"use client";

import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import FileUpload from '../_components/FileUpload';
import { Loader } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditListing({ params: paramsPromise }) {
    const params = React.use(paramsPromise); // Unwrapping the promise
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const [listing, setListing] = useState([]);
    const [images, setImages] = useState([]);

    const id = params?.id;

    useEffect(() => {
        if (user) {
            verifyUserRecord();
        }
    }, [user]);

    //VerfifyUserRecord
    const verifyUserRecord = async () => {
        const { data, error } = await supabase
            .from('listing')
            .select('*,listingImages(listing_id,url)')
            .eq('createdBy', user?.primaryEmailAddress.emailAddress)
            .eq('id', id);

        if (data) {
            console.log(data);
            setListing(data[0]);
        }

        if (data?.length <= 0) {
            router.replace('/');
        }
    };

    //OnSubmitHandler
    const onSubmitHandler = async (formValue) => {
        try {
            setLoading(true);
            console.log('Submitting Form Value Before:', formValue);
            const newObject = Object.fromEntries(
                Object.entries(formValue).filter(([key, value]) => (value != "" && value != 0))
            );
            console.log('Submitting Form Value:', newObject);

            // Update the listing
            const { data, error } = await supabase
                .from('listing')
                .update({
                    ...newObject,
                    createdBy: user?.primaryEmailAddress?.emailAddress || 'Unknown',
                })
                .eq('id', params?.id)
                .select();

            if (error) {
                console.log('Error updating listing:', error);
                toast('Error while updating listing', { type: "error" });
                return;
            }
            
            if (data) {
                console.log('Listing updated:', data);
                toast('Listing updated', { type: "success" });
            }

            // อัปโหลดรูปภาพ
            for (const image of images) {
                setLoading(true);
                const fileName = `${Date.now()}`;
                const fileExt = image.name.split('.').pop();
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('listingImages')
                    .upload(`${fileName}.${fileExt}`, image, {
                        contentType: `image/${fileExt}`,
                        upsert: false,
                    });

                if (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    toast('Error while uploading images');
                    continue;
                }

                const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${fileName}.${fileExt}`;
                const { data: insertData, error: insertError } = await supabase
                    .from('listingImages')
                    .insert([{ url: imageUrl, listing_id: id }])
                    .select();

                if (insertError) {
                    console.log('Error inserting image URL:', insertError);
                    toast('Error while saving image URL');
                    continue;
                }

                console.log('Image uploaded and URL saved:', insertData);
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            toast('Unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };


    const publishBtnHandler = async (formValue) => {
        try {
            setLoading(true);
            console.log('Publishing Form Value:', formValue);
            const newObject = Object.fromEntries(
                Object.entries(formValue).filter(([key, value]) => (value != "" && value != 0))
            );
    
            // เพิ่ม `active: true` ลงใน `formValue`
            const updatedValue = {
                ...newObject,
                createdBy: user?.primaryEmailAddress?.emailAddress || 'Unknown',
                active: true,
            };
    
            // อัปเดตข้อมูล Listing
            const { data: listingData, error: listingError } = await supabase
                .from('listing')
                .update(updatedValue)
                .eq('id', id);
    
            if (listingError) {
                throw new Error('Error updating listing: ' + listingError.message);
            }
    
            console.log('Listing Updated Successfully:', listingData);
    
            // ตรวจสอบว่ามีรูปภาพหรือไม่

    
            // แสดงข้อความสำเร็จ
            toast.success('Listing saved and published successfully!', { type: "success" });
        } catch (err) {
            console.log('Error:', err);
            toast.error('Error while publishing the listing. Please try again later.', {
                className: 'border-l-4 border-red-500',
            });
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <div className='px-10 md:px-36 my-10'>
            <ToastContainer />
            <h2 className='p-10 font-bold text-2xl mt-50 text-center'>Enter some more details about your listing</h2>

            <Formik
                initialValues={{
                    createdBy   : listing?.createdBy    || '',
                    active      : listing?.active       || false,
                    religions   : listing?.religions    || '',
                    roomsize    : listing?.roomsize     || '',
                    capacity    : listing?.capacity     || '',
                    parking     : listing?.parking      || '',
                    price       : listing?.price        || '',
                    roomtypes   : listing?.roomtypes    || '',
                    toilet      : listing?.toilet       || '',
                    description : listing?.description  || '',
                    name        : listing?.name         || '',
                    line        : listing?.line         || '',
                    facebook    : listing?.facebook     || '',
                    phone       : listing?.phone        || '',
                    profileImage: user?.imageUrl        || '',
                    fullName    : user?.fullName        || '',
                }}
                onSubmit={(values) => {
                    console.log('Form Values:', values); // ตรวจสอบค่าก่อนส่ง
                    onSubmitHandler(values);
                    
                }}
            >
                {({
                    values,
                    handleChange,
                    handleSubmit
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className='p-8 rounded-lg shadow-md'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Religions</h2>
                                    <Select onValueChange={(e) => values.religions = e} name="religions">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Choose Religions" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="buddhism">Buddhism</SelectItem>
                                            <SelectItem value="christianity">Christianity</SelectItem>
                                            <SelectItem value="islam">Islam</SelectItem>
                                            <SelectItem value="sikhism">Sikhism</SelectItem>
                                            <SelectItem value="judaism">Judaism</SelectItem>
                                        </SelectContent>
                                    </Select>



                                </div>
                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Room Types</h2>
                                    <Select onValueChange={(e) => values.roomtypes = e} name="roomtypes">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Choose Room types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard_room">Standard Room</SelectItem>
                                            <SelectItem value="fan_room">Fan Room</SelectItem>
                                            <SelectItem value="air_room">Air-Conditioned Room</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Accessible Toilet</h2>
                                    <RadioGroup onValueChange={(v) => values.toilet = v}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes_pwd" id="yes_pwd" />
                                            <Label htmlFor="yes_pwd">Yes</Label>

                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no_pwd" id="no_pwd" />
                                            <Label htmlFor="no_pwd">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Name</h2>
                                    <Textarea placeholder="" defaultValue={listing?.name} name="name" onChange={handleChange} />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Guest Capacity (People)</h2>
                                    <Input type="number" id="capacity" defaultValue={listing?.capacity}placeholder="Ex.200" name="capacity" onChange={handleChange} />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Room Size</h2>
                                    <Input type="number" id="roomsize" defaultValue={listing?.roomsize} placeholder="Ex.450 Sq.m" name="roomsize" onChange={handleChange} />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Parking</h2>
                                    <Input type="number" id="parking" defaultValue={listing?.parking} placeholder="Ex.20" name="parking" onChange={handleChange} />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Price Per Night (₿)</h2>
                                    <Input type="number" id="price" defaultValue={listing?.price} placeholder="Ex.500" name="price" onChange={handleChange} />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Line</h2>
                                    <Input id="line" placeholder="Line ID" defaultValue={listing?.line} name="line" onChange={handleChange} />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Facebook</h2>
                                    <Input id="facebook" placeholder="Link" defaultValue={listing?.facebook} name="facebook" onChange={handleChange} />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h2 className='text-lg text-slate-500'>Phone</h2>
                                    <Input id="phone" placeholder="Ex. 0801234567" defaultValue={listing?.phone} name="phone" onChange={handleChange} />
                                </div>

                            </div>

                            <div className='grid grid-cols-1 gap-10 mt-8 mb-8'>
                                <div className='flex gap-2 flex-col'>
                                    <h2 className='text-lg text-slate-500'>Description</h2>
                                    <Textarea placeholder="" defaultValue={listing?.description} name="description" onChange={handleChange} />
                                </div>
                            </div>

                            <div>
                                <h2 className='text-lg text-slate-500 my-2'>Upload Images</h2>
                                <FileUpload
                                    setImages={(value) => setImages(value)}
                                    imageList={listing?.listingImages || []}
                                />
                            </div>

                            <div className='flex gap-7 justify-end mt-8'>

                                <Button disabled={loading} variant="outline" className="text-primary border-primary">
                                    {loading ? <Loader className='animate-spin' /> : 'Save'}
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button type="button" disabled={loading}>
                                            {loading ? <Loader className='animate-spin' /> : 'Save & Publish'}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Ready to Publish?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Do you really want to publish the listing?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => publishBtnHandler(values)} >
                                                {loading ? <Loader className='animate-spin' /> : 'Continue'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>


                            </div>
                        </div>
                    </form>)}
            </Formik>
        </div>
    )
}

export default EditListing;