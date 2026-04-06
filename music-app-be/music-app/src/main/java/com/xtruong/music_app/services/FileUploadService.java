package com.xtruong.music_app.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileUploadService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) throws IOException {
        // resource_type "auto" giúp Cloudinary tự nhận diện đây là ảnh (image) hay âm thanh (video/raw)
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap("resource_type", "auto"));

        // Trả về URL bảo mật (https) của file đã upload thành công
        return uploadResult.get("secure_url").toString();
    }
}