# 🚀 Render Premium Deployment Guide

## 📋 Overview

This guide covers deploying the Video Crew Portfolio application to Render Premium with persistent disk storage for file uploads.

## 🎯 Prerequisites

- Render Premium account
- MongoDB database (existing)
- GitHub repository access

## 🔧 Environment Variables Setup

### **Required Environment Variables**

Add these environment variables in your Render dashboard:

#### **Core Application Variables:**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

#### **Persistent Disk Storage (NEW):**
```env
RENDER_PERSISTENT_DISK_PATH=/var/data/uploads
```

## 💾 Persistent Disk Setup

### **Step 1: Create Persistent Disk**

1. Go to your Render dashboard
2. Navigate to your backend service
3. Click on "Disks" tab
4. Click "Create Disk"
5. Configure:
   - **Name**: `uploads-storage`
   - **Size**: Start with 10GB (can increase later)
   - **Mount Path**: `/var/data`
   - **File System**: ext4

### **Step 2: Update Environment Variables**

Add the persistent disk path:
```env
RENDER_PERSISTENT_DISK_PATH=/var/data/uploads
```

### **Step 3: Redeploy Service**

1. Go to "Manual Deploy" in your service
2. Click "Deploy latest commit"
3. Wait for deployment to complete

## 🔍 Verification Steps

### **1. Check Environment Variables**
After deployment, check logs for:
```
🔧 Environment Configuration:
   NODE_ENV: production
   PORT: 5000
   MONGO_URI: ✅ Set
   JWT_SECRET: ✅ Set
   Storage Path: /var/data/uploads (Persistent Disk)
✅ Environment validation passed
```

### **2. Test File Upload**
1. Go to admin panel
2. Try uploading an image (10MB max)
3. Try uploading a video (100MB max)
4. Verify files are accessible via URLs

### **3. Verify Persistence**
1. Upload a test file
2. Restart the service (or wait for daily restart)
3. Check if the file is still accessible
4. File should persist across restarts

## 📊 Expected Log Output

### **Successful Deployment:**
```
📁 Using upload directory for RENDER_PERSISTENT_DISK_PATH: /var/data/uploads
✅ Upload directory already exists: /var/data/uploads
🌐 Using static uploads path for RENDER_PERSISTENT_DISK_PATH: /var/data/uploads
✅ Server running on port 5000
```

### **File Upload Success:**
```
📸 Image upload started: image.jpg (2097152 bytes, image/jpeg)
✅ Image uploaded successfully: 1703123456789-123456789.jpg -> https://your-domain.com/uploads/1703123456789-123456789.jpg
```

## ⚠️ Important Notes

### **Persistent Disk Limitations:**
- **Single Instance**: Cannot scale horizontally
- **No Zero-Downtime Deploys**: Brief downtime during deployments
- **Size**: Can only increase, not decrease

### **File Size Limits:**
- **Images**: 10MB maximum
- **Videos**: 100MB maximum
- **Total Storage**: Limited by disk size

### **Backup Strategy:**
- Render creates daily snapshots automatically
- Snapshots retained for 7+ days
- Consider additional backup for critical files

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. Files Not Persisting**
**Problem**: Files disappear after restart
**Solution**: 
- Verify `RENDER_PERSISTENT_DISK_PATH` is set correctly
- Check if persistent disk is properly mounted
- Ensure upload directory exists

#### **2. Upload Directory Not Found**
**Problem**: `ENOENT: no such file or directory`
**Solution**:
- Check persistent disk mount path
- Verify environment variable is set
- Check disk permissions

#### **3. Permission Denied**
**Problem**: `EACCES: permission denied`
**Solution**:
- Check disk permissions
- Ensure service has write access
- Contact Render support if needed

#### **4. Disk Space Full**
**Problem**: `ENOSPC: no space left on device`
**Solution**:
- Increase disk size in Render dashboard
- Clean up old files
- Monitor disk usage

## 📈 Monitoring

### **Key Metrics to Monitor:**
- Disk usage percentage
- Upload success rate
- File access response times
- Error rates

### **Log Monitoring:**
Watch for these log patterns:
- `✅ Image uploaded successfully`
- `❌ Image upload error`
- `📁 Using upload directory`
- `🌐 Using static uploads path`

## 🔄 Migration from Free Tier

### **Current State (Free Tier):**
- Files stored in ephemeral storage
- Files lost on every restart
- No persistence

### **After Migration (Premium):**
- Files stored in persistent disk
- Files survive restarts
- Full persistence

### **Migration Steps:**
1. Upgrade to Render Premium
2. Create persistent disk
3. Set environment variable
4. Redeploy application
5. Test file uploads
6. Verify persistence

## 📞 Support

If you encounter issues:
1. Check Render service logs
2. Verify environment variables
3. Test with small files first
4. Contact Render support for disk-related issues

## ✅ Success Checklist

- [ ] Render Premium account active
- [ ] Persistent disk created and mounted
- [ ] Environment variables set correctly
- [ ] Application deployed successfully
- [ ] File uploads working
- [ ] Files persisting across restarts
- [ ] Static file serving working
- [ ] Error handling working properly

---

**🎉 Congratulations!** Your file upload system is now running on Render Premium with persistent storage!
