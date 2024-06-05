import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'mudemoenv', 
  api_key: '216618791292249', 
  api_secret: 'P4Nk7c481vzAZkdehLgPY2huZvc' 
});


const uploadOnCloudinary = async(localpath) => {
try {

    if(!localpath) return null


    console.log("uploadind .............")
    const response=   cloudinary.uploader.upload(localpath , {
        resource_type : "auto"
    });

    console.log("uploaded on cloudinary successfully ...............")

    // fs.unlinkSync(localFilePath)
    return response;
 
    
} catch (error) {
    //  remove the locally saved temporary file as the upload operation got failed
    fs.unlinkSync(localFilePath)

    return null;
}

}


export {uploadOnCloudinary}