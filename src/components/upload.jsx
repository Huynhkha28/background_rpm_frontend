import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Select } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import { CloseOutlined, DownloadOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';
import mergeImages from 'merge-images';
import { bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg13, bg14 } from '../../public/background';
const { Option } = Select;
const Upload = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [loadings, setLoadings] = useState([]);
    const [selectedBackground, setSelectedBackground] = useState('');
    const [imageResponse, setImageResponse] = useState('');
    const handleChoseBackground = (value) => {
        console.log(value);
        setSelectedBackground(value);
    };
    const backgroundArr = [
        { index: 0, backgroundlabel: 'No background', imgSrc: `data:image/png;base64,${imageResponse}` },
        { index: 1, backgroundlabel: 'Background1', imgSrc: bg1 },
        { index: 2, backgroundlabel: 'Background2', imgSrc: bg2 },
        { index: 3, backgroundlabel: 'Background3', imgSrc: bg3 },
        { index: 4, backgroundlabel: 'Background4', imgSrc: bg4 },
        { index: 5, backgroundlabel: 'Background5', imgSrc: bg5 },
        { index: 6, backgroundlabel: 'Background6', imgSrc: bg6 },
        { index: 7, backgroundlabel: 'Background7', imgSrc: bg7 },
        { index: 8, backgroundlabel: 'Background8', imgSrc: bg8 },
        { index: 9, backgroundlabel: 'Background9', imgSrc: bg9 },
        { index: 10, backgroundlabel: 'Background10', imgSrc: bg10 },
        { index: 11, backgroundlabel: 'Background11', imgSrc: bg11 },
        { index: 12, backgroundlabel: 'Background12', imgSrc: bg12 },
        { index: 13, backgroundlabel: 'Background13', imgSrc: bg13 },
    ];
    const onDrop = useCallback(async (acceptedFiles) => {
        // Xử lý tệp tin sau khi được chấp nhận
        const newImages = acceptedFiles.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));

        // Cập nhật state với danh sách ảnh mới
        setUploadedImages((prevImages) => [...prevImages, ...newImages]);
    }, []);

    const enterLoading = async (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });

        try {
            // Gửi yêu cầu POST đến API endpoint
            const formData = new FormData();
            formData.append('image', uploadedImages[index].file);
            //formData.append('model', selectedModel);
            const responseAPI = await axios.post('http://localhost:3002/api/remove-background', formData, { withCredentials: true });
            //const imageBase64 = await base64EncodeUnicode(responseAPI.data);
            setImageResponse(responseAPI.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }
    };
    const handleDownloadClick = () => {
        if (!selectedBackground) {
            const byteCharacters = atob(`data:image/png;base64,${imageResponse}`.split(',')[1]);
            const byteArrays = [];

            for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: 'image/png' });
            // Tải về tệp tin
            saveAs(blob, 'image.png');
        }
        else {
            mergeImages([
                { src: `${selectedBackground}`, x: 0, y: 0 },
                { src: `data:image/png;base64,${imageResponse}`, x: 0, y: 0 },
            ]).then((imgResponse) => {
                const byteCharacters = atob(`${imgResponse}`.split(',')[1]);
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);

                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }

                const blob = new Blob(byteArrays, { type: 'image/png' });

                // Tải về tệp tin
                saveAs(blob, 'image.png');
            });
        }

    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <>
            <div className='w-[1250px] mx-auto flex flex-col justify-center items-center'>
                <div className='w-[450px] border flex justify-center items-center h-[150px] rounded-lg'>
                    <div {...getRootProps()} className='border-dashed border-2 hover:cursor-pointer border-indigo-600 px-4 py-8 rounded-lg'>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Thả tệp vào đây...</p>
                        ) : (
                            <p className='text-[16px] '>Kéo và thả hoặc nhấn vào để chọn tệp</p>
                        )}
                    </div>
                </div>
                <div className='flex w-full mt-4 h-[400px]'>
                    {uploadedImages.map((image, index) => (
                        <div key={index} className='p-2 '>
                            <div className='w-fit cursor-pointer' onClick={() => setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index))}><CloseOutlined /></div>
                            <img width={300} height={300} src={image.preview} alt={`Uploaded ${index}`} className='rounded-[10px] w-[300px] h-auto' />
                            <div className='flex justify-center items-center mt-4'>
                                <Button type="primary" className='bg-[#1677ff]' loading={loadings[0]} onClick={() => enterLoading(0)}>
                                    Tách nền
                                </Button>
                            </div>
                        </div>
                    ))}
                    {imageResponse &&
                        (
                            <div className='flex- flex row'>
                                <div className='p-2  border-l'>
                                    <div className='w-fit cursor-pointer' onClick={() => setImageResponse('')}><CloseOutlined /></div>
                                    <div className='h-full flex flex-col'>
                                        <img width={300} height={300} src={`data:image/png;base64,${imageResponse}`} alt='mask'
                                            className='rounded-[10px] w-[300px] h-[300px] object-cover z-10 relative' />
                                        {/* <div className='h-[65px] mt-4'></div> */}
                                        {selectedBackground ? (<div className='flex justify-center flex-col items-center relative top-[-300px]  '>
                                            <Image width={300} height={300} src={selectedBackground} alt='mask'
                                                className='rounded-[10px] w-[300px] relative h-[300px] object-cover' />
                                            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadClick} className='bg-[#1677ff] mt-4'>
                                                Download
                                            </Button>
                                        </div>) : (<div className='flex justify-center flex-col items-center relative top-[-300px]  '>
                                            <div className='rounded-[10px] w-[300px] relative h-[300px] object-cover'>
                                            </div>
                                            <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadClick} className='bg-[#1677ff] mt-4'>
                                                Download
                                            </Button>
                                        </div>)}
                                    </div>
                                </div>
                                <div className='pt-2 pl-2  border-l flex flex-col'>
                                    <span>Lựa chọn Background</span>
                                    <Select optionLabelProp="label"
                                        style={{ width: 300 }}>
                                        {
                                            backgroundArr.map((background) => (
                                                <Option value={background?.imgSrc?.default?.src} label={background.backgroundlabel} key={background.index} >
                                                    <div className='h-[200px]' >
                                                        <Image width={200} height={180} src={background?.imgSrc?.default?.src} alt='mask'
                                                            className='w-full object-cover' onClick={() => handleChoseBackground(background?.imgSrc?.default?.src)} />
                                                    </div>
                                                </Option>
                                            ))}
                                    </Select>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default Upload;
