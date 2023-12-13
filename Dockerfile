FROM python:3.9

# Install dependencies for YoBo API
RUN pip install -r requirements.txt

# Copy YoBo API code
WORKDIR /app
COPY . .

# Install Vertex AI Prediction client library
RUN pip install google-cloud-aiplatform

# Install book-recommendations model dependencies
RUN pip install -r book-recommendations/requirements.txt

# Copy book-recommendations model code
COPY book-recommendations ./book-recommendations

# Download trained model files (replace with actual location)
RUN wget https://storage.googleapis.com/your_bucket/model.tar.gz
RUN tar -xf model.tar.gz -C ./book-recommendations/model

# Expose API port
EXPOSE 8000

# Run YoBo API server
CMD ["python", "server.js"]
