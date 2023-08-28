FROM docker.io/bitnami/laravel:10

# Set the working directory
WORKDIR /app

# Copy the scripts
COPY scripts /etc/scripts

# Give execution rights
RUN chmod -R +x /etc/scripts/*

# Expose the port
EXPOSE 8000

# Run the startup script
CMD ["/etc/scripts/startup.sh"]
