/** @format */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { PlusCircle, X } from 'lucide-react';
import {
  insertAttractionAndTickets,
  uploadAttractionImage,
  uploadAttractionBarcode,
} from '@/lib/functions/attractions';

const openingHoursSchema = z.object({
  open: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  close: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
});

const weekOpeningHoursSchema = z.object({
  monday: openingHoursSchema,
  tuesday: openingHoursSchema,
  wednesday: openingHoursSchema,
  thursday: openingHoursSchema,
  friday: openingHoursSchema,
  saturday: openingHoursSchema,
  sunday: openingHoursSchema,
});

const ticketSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  currency: z.string().min(1, 'Currency is required'),
  validity_start: z.string().min(1, 'Start date is required'),
  validity_end: z.string().min(1, 'End date is required'),
});

const attractionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  short_description: z.string().min(1, 'Short description is required'),
  long_description: z.string().min(1, 'Long description is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  opening_hours: weekOpeningHoursSchema,
  tickets: z.array(ticketSchema),
});

type AttractionForm = z.infer<typeof attractionSchema>;

const defaultOpeningHours = {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: { open: '10:00', close: '18:00' },
  sunday: { open: '10:00', close: '18:00' },
};

export default function AddAttraction() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [barcodeFile, setBarcodeFile] = useState<File | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/login');
      }
    }
    checkAuth();
  }, [router]);

  const form = useForm<AttractionForm>({
    resolver: zodResolver(attractionSchema),
    defaultValues: {
      name: '',
      short_description: '',
      long_description: '',
      address: '',
      city: '',
      country: '',
      opening_hours: defaultOpeningHours,
      tickets: [
        {
          name: '',
          description: '',
          price: '',
          currency: 'EUR',
          validity_start: '',
          validity_end: '',
        },
      ],
    },
  });

  async function onSubmit(data: AttractionForm) {
    try {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      let imageUrl = '';
      let barcodeUrl = '';

      if (imageFile) {
        imageUrl = await uploadAttractionImage(imageFile, user.id);
      }

      if (barcodeFile) {
        barcodeUrl = await uploadAttractionBarcode(barcodeFile, user.id);
      }

      const { tickets, ...attractionData } = data;
      await insertAttractionAndTickets(
        user.id,
        {
          ...attractionData,
          opening_hours: data.opening_hours,
          image_url: imageUrl,
          barcode_url: barcodeUrl,
        },
        tickets
      );

      toast.success('Attraction added successfully');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error('Failed to add attraction');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const addTicket = () => {
    const currentTickets = form.getValues('tickets');
    form.setValue('tickets', [
      ...currentTickets,
      {
        name: '',
        description: '',
        price: '',
        currency: 'EUR',
        validity_start: '',
        validity_end: '',
      },
    ]);
  };

  const removeTicket = (index: number) => {
    const currentTickets = form.getValues('tickets');
    if (currentTickets.length > 1) {
      form.setValue(
        'tickets',
        currentTickets.filter((_, i) => i !== index)
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const handleBarcodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBarcodeFile(file);
    }
  };

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const;

  return (
    <div className='max-w-2xl mx-auto py-6'>
      <Card>
        <CardHeader>
          <CardTitle>Add New Attraction</CardTitle>
          <CardDescription>
            Enter the details of your new attraction below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Dolphin Feeding' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='short_description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='A brief description of your attraction'
                        className='h-20'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='long_description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Long Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='A detailed description of your attraction'
                        className='h-32'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='123 Zoo Street' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder='Amsterdam' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder='Netherlands' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Opening Hours</h3>
                <div className='grid gap-4'>
                  {days.map((day) => (
                    <div
                      key={day}
                      className='grid grid-cols-3 gap-4 items-center'
                    >
                      <div className='capitalize'>{day}</div>
                      <FormField
                        control={form.control}
                        name={`opening_hours.${day}.open`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type='time' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`opening_hours.${day}.close`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type='time' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Media</h3>
                <div className='grid gap-4'>
                  <div>
                    <FormLabel>Attraction Image</FormLabel>
                    <div className='mt-2'>
                      <Input
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                      />
                    </div>
                  </div>
                  <div>
                    <FormLabel>Barcode File</FormLabel>
                    <div className='mt-2'>
                      <Input
                        type='file'
                        accept='.csv,.txt,.pdf'
                        onChange={handleBarcodeUpload}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-lg font-semibold'>Tickets</h3>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addTicket}
                  >
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Add Ticket
                  </Button>
                </div>

                {form.watch('tickets').map((_, index) => (
                  <Card key={index}>
                    <CardContent className='pt-6'>
                      <div className='flex justify-between items-start mb-4'>
                        <h4 className='text-sm font-medium'>
                          Ticket {index + 1}
                        </h4>
                        {form.watch('tickets').length > 1 && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => removeTicket(index)}
                          >
                            <X className='h-4 w-4' />
                          </Button>
                        )}
                      </div>

                      <div className='space-y-4'>
                        <FormField
                          control={form.control}
                          name={`tickets.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ticket Name</FormLabel>
                              <FormControl>
                                <Input placeholder='Adult Ticket' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`tickets.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder='Ticket description'
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className='grid grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name={`tickets.${index}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input
                                    type='number'
                                    step='0.01'
                                    placeholder='29.99'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tickets.${index}.currency`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <FormControl>
                                  <Input placeholder='EUR' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name={`tickets.${index}.validity_start`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valid From</FormLabel>
                                <FormControl>
                                  <Input type='datetime-local' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`tickets.${index}.validity_end`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Valid Until</FormLabel>
                                <FormControl>
                                  <Input type='datetime-local' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Attraction'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
