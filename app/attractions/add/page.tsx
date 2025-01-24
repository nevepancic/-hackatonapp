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
import { insertAttractionAndTickets } from '@/lib/functions/attractions';

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
  tickets: z.array(ticketSchema),
});

type AttractionForm = z.infer<typeof attractionSchema>;

export default function AddAttraction() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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

      const { tickets, ...attractionData } = data;
      await insertAttractionAndTickets(user.id, attractionData, tickets);

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
