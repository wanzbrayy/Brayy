# Gunakan image Node.js versi stabil
FROM node:18

# Set working directory
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin semua file proyek
COPY . .

# Ekspos port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
