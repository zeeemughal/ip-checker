# Use nginx:alpine as base image
FROM nginx:alpine

# Copy the HTML file to nginx's default serving directory
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Use the default nginx command
CMD ["nginx", "-g", "daemon off;"]
