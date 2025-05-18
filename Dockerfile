FROM node:23.11.0-alpine AS build

WORKDIR /app

# 1) Install dependencies
COPY package*.json ./
RUN npm ci

# 2) Copy all source files
COPY . .

ARG REACT_APP_API_HOST
ENV REACT_APP_API_HOST=${REACT_APP_API_HOST}

# 4) Build the React app
RUN npm run build

# Stage 2: serve the static build with nginx
FROM nginx:alpine

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]