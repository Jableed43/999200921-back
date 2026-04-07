import {supabase} from '../config/supabase.js'

// Vamos a armar un metodo que al subir la imagen al backend se la envie a supabase y despues obtenga la url de dicha imagen
export const uploadImageToSupabase = async (file, bucketName) => {
    try {
        // Cada vez que subis archivos, el nombre del archivo es su identificador unico
        // darle un nombre unico a cada foto
        // genera un nombre nuevo para evitar colisiones
        const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
        const filePath = fileName;

        // subida del buffer a supabase
        const {data, error} = await supabase.storage
            .from(bucketName)
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            })

        if (error) {
            console.error("Error al subir a Supabase:", error.message);
            throw error;
        }

        // Obtenemos la url de descarga (debe ser de un bucket publico)
        const { data: {publicUrl} } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath)
            console.log({data})
        
        return publicUrl
    
    } catch (error) {
        console.error("Error detallado en uploadImageToSupabase:", error);
        throw new Error("Error al subir la imagen a Supabase Storage");
    }
}