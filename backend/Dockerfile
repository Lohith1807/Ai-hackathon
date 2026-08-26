FROM node:18-alpine

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Change ownership
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

CMD ["node", "server.js"]
