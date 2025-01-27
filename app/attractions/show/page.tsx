/** @format */

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/functions/user';
import {
  getAttractions,
  updateAttraction,
  deleteAttraction,
  updateTicket,
  deleteTicket,
  type Attraction,
  type UpdateAttractionData,
  type UpdateTicketData,
} from '@/lib/functions/attractions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Globe,
  MoreVertical,
  Pencil,
  Trash,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Ticket,
  Clock,
  Euro,
  Download,
  ImageIcon,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Image from 'next/image';

interface Ticket {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  validity_start: string;
  validity_end: string;
}

interface AttractionWithTickets extends Attraction {
  tickets: Ticket[];
}

type StatusType = 'all' | 'pending' | 'approved' | 'declined';
type SortType = 'name' | 'date';
type SortDirection = 'asc' | 'desc';

export default function ShowAttractions() {
  const [attractions, setAttractions] = useState<AttractionWithTickets[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<StatusType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(
    null
  );
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingAttractionId, setDeletingAttractionId] = useState<
    string | null
  >(null);
  const [expandedAttractions, setExpandedAttractions] = useState<Set<string>>(
    new Set()
  );
  const [editForm, setEditForm] = useState<UpdateAttractionData>({
    name: '',
    short_description: '',
    long_description: '',
    address: '',
    city: '',
    country: '',
  });
  const [editingTicket, setEditingTicket] = useState<{
    id: string;
    attractionId: string;
    data: UpdateTicketData;
  } | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<string | null>(null);
  const [showDeleteTicketDialog, setShowDeleteTicketDialog] = useState(false);

  useEffect(() => {
    loadAttractions();
  }, []);

  async function loadAttractions() {
    try {
      const user = await getCurrentUser();
      const userAttractions = await getAttractions(user.id);
      setAttractions(userAttractions);
    } catch (error) {
      console.error('Error loading attractions:', error);
      toast.error('Failed to load attractions');
    } finally {
      setLoading(false);
    }
  }

  const toggleExpand = (attractionId: string) => {
    const newExpanded = new Set(expandedAttractions);
    if (newExpanded.has(attractionId)) {
      newExpanded.delete(attractionId);
    } else {
      newExpanded.add(attractionId);
    }
    setExpandedAttractions(newExpanded);
  };

  const handleEdit = (attraction: Attraction) => {
    setEditingAttraction(attraction);
    setEditForm({
      name: attraction.name,
      short_description: attraction.short_description,
      long_description: attraction.long_description,
      address: attraction.address,
      city: attraction.city,
      country: attraction.country,
    });
  };

  const handleDelete = async (attractionId: string) => {
    try {
      const user = await getCurrentUser();
      await deleteAttraction(attractionId, user.id);
      await loadAttractions();
      toast.success('Attraction deleted successfully');
    } catch (error) {
      console.error('Error deleting attraction:', error);
      toast.error('Failed to delete attraction');
    } finally {
      setShowDeleteDialog(false);
      setDeletingAttractionId(null);
    }
  };

  const handleUpdate = async () => {
    if (!editingAttraction) return;

    try {
      const user = await getCurrentUser();
      await updateAttraction(editingAttraction.id, user.id, editForm);
      await loadAttractions();
      setEditingAttraction(null);
      toast.success('Attraction updated successfully');
    } catch (error) {
      console.error('Error updating attraction:', error);
      toast.error('Failed to update attraction');
    }
  };

  const handleEditTicket = async () => {
    if (!editingTicket) return;

    try {
      const user = await getCurrentUser();
      await updateTicket(editingTicket.id, user.id, editingTicket.data);
      await loadAttractions();
      setEditingTicket(null);
      toast.success('Ticket updated successfully');
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const user = await getCurrentUser();
      await deleteTicket(ticketId, user.id);
      await loadAttractions();
      toast.success('Ticket deleted successfully');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    } finally {
      setShowDeleteTicketDialog(false);
      setDeletingTicketId(null);
    }
  };

  const toggleSort = (type: SortType) => {
    if (sortBy === type) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortDirection('asc');
    }
  };

  const sortedAndFilteredAttractions = attractions
    .filter((attraction) => {
      if (currentStatus === 'all') return true;
      return attraction.status === currentStatus;
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name) * modifier;
      } else {
        return (
          (new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()) *
          modifier
        );
      }
    });

  const getStatusClassName = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6 p-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Your Attractions</h1>
        <p className='text-muted-foreground'>
          Manage and view all your registered attractions
        </p>
      </div>

      <div className='flex justify-between items-center'>
        <Tabs
          defaultValue='all'
          value={currentStatus}
          onValueChange={(value) => setCurrentStatus(value as StatusType)}
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='approved'>Approved</TabsTrigger>
            <TabsTrigger value='pending'>Pending</TabsTrigger>
            <TabsTrigger value='declined'>Declined</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className='flex gap-2 ml-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => toggleSort('name')}
            className={cn('whitespace-nowrap', sortBy === 'name' && 'bg-muted')}
          >
            Name
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => toggleSort('date')}
            className={cn('whitespace-nowrap', sortBy === 'date' && 'bg-muted')}
          >
            Date
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {sortedAndFilteredAttractions.map((attraction) => (
          <Card
            key={attraction.id}
            className='hover:shadow-lg transition-shadow overflow-hidden'
          >
            {attraction.image_url && (
              <div className='w-full h-48 overflow-hidden'>
                <img
                  src={attraction.image_url}
                  alt={attraction.name}
                  className='w-full h-full object-cover'
                />
              </div>
            )}
            {!attraction.image_url && (
              <div className='w-full h-48 bg-muted flex items-center justify-center'>
                <ImageIcon className='h-12 w-12 text-muted-foreground' />
              </div>
            )}
            <CardHeader>
              <div className='flex justify-between items-start'>
                <CardTitle className='text-xl font-bold'>
                  {attraction.name}
                </CardTitle>
                <div className='flex items-center gap-2'>
                  <Badge
                    className={cn(
                      'font-medium',
                      getStatusClassName(attraction.status)
                    )}
                  >
                    {attraction.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon'>
                        <MoreVertical className='h-4 w-4' />
                        <span className='sr-only'>Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => handleEdit(attraction)}>
                        <Pencil className='mr-2 h-4 w-4' />
                        Edit
                      </DropdownMenuItem>
                      {attraction.barcode_url && (
                        <DropdownMenuItem
                          onClick={() =>
                            window.open(attraction.barcode_url, '_blank')
                          }
                        >
                          <Download className='mr-2 h-4 w-4' />
                          Download Barcode
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className='text-red-600'
                        onClick={() => {
                          setDeletingAttractionId(attraction.id);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash className='mr-2 h-4 w-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p className='text-muted-foreground line-clamp-2'>
                {attraction.short_description}
              </p>

              <div className='space-y-2'>
                <div className='flex items-center text-sm'>
                  <MapPin className='h-4 w-4 mr-2 text-muted-foreground' />
                  {attraction.address}, {attraction.city}
                </div>
                <div className='flex items-center text-sm'>
                  <Globe className='h-4 w-4 mr-2 text-muted-foreground' />
                  {attraction.country}
                </div>
              </div>

              <div className='pt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full'
                  onClick={() => toggleExpand(attraction.id)}
                >
                  <Ticket className='h-4 w-4 mr-2' />
                  {expandedAttractions.has(attraction.id) ? (
                    <>
                      Hide Tickets
                      <ChevronUp className='h-4 w-4 ml-2' />
                    </>
                  ) : (
                    <>
                      Show Tickets
                      <ChevronDown className='h-4 w-4 ml-2' />
                    </>
                  )}
                </Button>

                {expandedAttractions.has(attraction.id) && (
                  <div className='mt-4 space-y-3'>
                    {attraction.tickets?.map((ticket) => (
                      <Card key={ticket.id} className='bg-muted'>
                        <CardContent className='p-4'>
                          <div className='flex justify-between items-start mb-2'>
                            <h4 className='font-semibold'>{ticket.name}</h4>
                            <div className='flex items-center gap-2'>
                              <Badge variant='secondary' className='ml-2'>
                                <Euro className='h-3 w-3 mr-1' />
                                {ticket.price} {ticket.currency}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant='ghost' size='sm'>
                                    <MoreVertical className='h-3 w-3' />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='end'>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      setEditingTicket({
                                        id: ticket.id,
                                        attractionId: attraction.id,
                                        data: {
                                          name: ticket.name,
                                          description: ticket.description,
                                          price: ticket.price,
                                          currency: ticket.currency,
                                          validity_start: ticket.validity_start,
                                          validity_end: ticket.validity_end,
                                        },
                                      })
                                    }
                                  >
                                    <Pencil className='mr-2 h-3 w-3' />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className='text-red-600'
                                    onClick={() => {
                                      setDeletingTicketId(ticket.id);
                                      setShowDeleteTicketDialog(true);
                                    }}
                                  >
                                    <Trash className='mr-2 h-3 w-3' />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className='text-sm text-muted-foreground mb-2'>
                            {ticket.description}
                          </p>
                          <div className='flex items-center text-xs text-muted-foreground'>
                            <Clock className='h-3 w-3 mr-1' />
                            Valid:{' '}
                            {format(
                              new Date(ticket.validity_start),
                              'PP'
                            )} - {format(new Date(ticket.validity_end), 'PP')}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {(!attraction.tickets ||
                      attraction.tickets.length === 0) && (
                      <p className='text-sm text-muted-foreground text-center py-2'>
                        No tickets available for this attraction
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className='text-xs text-muted-foreground mt-4'>
                Last updated:{' '}
                {new Date(attraction.updated_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedAndFilteredAttractions.length === 0 && (
        <div className='text-center py-12'>
          <h3 className='text-lg font-semibold'>No attractions found</h3>
          <p className='text-muted-foreground'>
            {currentStatus === 'all'
              ? "You haven't added any attractions yet."
              : `No ${currentStatus} attractions found.`}
          </p>
        </div>
      )}

      <Dialog
        open={!!editingAttraction}
        onOpenChange={() => setEditingAttraction(null)}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Attraction</DialogTitle>
            <DialogDescription>
              Make changes to your attraction here.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <label htmlFor='name'>Name</label>
              <Input
                id='name'
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='short_description'>Short Description</label>
              <Textarea
                id='short_description'
                value={editForm.short_description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    short_description: e.target.value,
                  })
                }
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='long_description'>Long Description</label>
              <Textarea
                id='long_description'
                value={editForm.long_description}
                onChange={(e) =>
                  setEditForm({ ...editForm, long_description: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <label htmlFor='address'>Address</label>
              <Input
                id='address'
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <label htmlFor='city'>City</label>
                <Input
                  id='city'
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm({ ...editForm, city: e.target.value })
                  }
                />
              </div>
              <div className='grid gap-2'>
                <label htmlFor='country'>Country</label>
                <Input
                  id='country'
                  value={editForm.country}
                  onChange={(e) =>
                    setEditForm({ ...editForm, country: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setEditingAttraction(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              attraction and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingAttractionId && handleDelete(deletingAttractionId)
              }
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={!!editingTicket}
        onOpenChange={() => setEditingTicket(null)}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>
              Make changes to your ticket here.
            </DialogDescription>
          </DialogHeader>
          {editingTicket && (
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <label htmlFor='ticket-name'>Name</label>
                <Input
                  id='ticket-name'
                  value={editingTicket.data.name}
                  onChange={(e) =>
                    setEditingTicket({
                      ...editingTicket,
                      data: { ...editingTicket.data, name: e.target.value },
                    })
                  }
                />
              </div>
              <div className='grid gap-2'>
                <label htmlFor='ticket-description'>Description</label>
                <Textarea
                  id='ticket-description'
                  value={editingTicket.data.description}
                  onChange={(e) =>
                    setEditingTicket({
                      ...editingTicket,
                      data: {
                        ...editingTicket.data,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <label htmlFor='ticket-price'>Price</label>
                  <Input
                    id='ticket-price'
                    type='number'
                    step='0.01'
                    value={editingTicket.data.price}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        data: {
                          ...editingTicket.data,
                          price: parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <label htmlFor='ticket-currency'>Currency</label>
                  <Input
                    id='ticket-currency'
                    value={editingTicket.data.currency}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        data: {
                          ...editingTicket.data,
                          currency: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <label htmlFor='ticket-start'>Valid From</label>
                  <Input
                    id='ticket-start'
                    type='datetime-local'
                    value={editingTicket.data.validity_start}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        data: {
                          ...editingTicket.data,
                          validity_start: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <label htmlFor='ticket-end'>Valid Until</label>
                  <Input
                    id='ticket-end'
                    type='datetime-local'
                    value={editingTicket.data.validity_end}
                    onChange={(e) =>
                      setEditingTicket({
                        ...editingTicket,
                        data: {
                          ...editingTicket.data,
                          validity_end: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditingTicket(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditTicket}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showDeleteTicketDialog}
        onOpenChange={setShowDeleteTicketDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              ticket.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteTicketDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingTicketId && handleDeleteTicket(deletingTicketId)
              }
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
