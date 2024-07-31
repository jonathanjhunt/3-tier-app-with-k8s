#!/bin/bash
# Check for Prerequisites
# echo "Checking for Prerequisites..."
# # 1. Check sudo minikube
# echo "Checking for sudo minikube..."
# sleep 1
# if ! command -v sudo minikube &> /dev/null; then
#     echo "sudo minikube is not installed. Please install sudo minikube. Refer to the GitHub documentation for installation instructions."
#     exit 1
# fi
# echo "sudo minikube is installed."
# sleep 1
# # 2. Check sudo kubectl
# echo "Checking for sudo kubectl..."
# sleep 1
# if ! command -v sudo kubectl &> /dev/null; then
#     echo "sudo kubectl is not installed. Please install sudo kubectl. Refer to the GitHub documentation for installation instructions."
#     exit 1
# fi
# echo "sudo kubectl is installed."
# sleep 1
# # 3. Check Helm
# echo "Checking for Helm..."
# sleep 1
# if ! command -v helm &> /dev/null; then
#     echo "Helm is not installed. Please install Helm. Refer to the GitHub documentation for installation instructions."
#     exit 1
# fi
# echo "Helm is installed."
# sleep 1
# # 4. Check Docker
# echo "Checking for Docker..."
# sleep 1
# if ! command -v docker &> /dev/null; then
#     echo "Docker is not installed. Please install Docker. Refer to the GitHub documentation for installation instructions."
#     exit 1
# fi
# echo "Docker is installed."
# sleep 2
# # 5. Check that Docker is running
# echo "Checking if Docker is running..."
# sleep 1
# if ! docker info &> /dev/null; then
#     echo "Docker is not running. Please start Docker."
#     exit 1
# fi
# Application Start-Up
# Starting the sudo minikube Cluster
echo "---------------------Beginning Application Start-Up...---------------------"
sleep 2
echo "Starting the sudo minikube cluster with one virtual node..."    
sudo minikube start --force --driver=docker
echo "sudo minikube Cluster has been started."
sleep 1
echo "Status of the sudo minikube Cluster..."
sudo minikube status
Applying the kubernetes manifests
echo "Applying the Kubernetes manifests..."
sleep 1
# MongoDB Deployment
echo "Creating the MongoDB Deployment..."
sudo kubectl apply -f ./infrastructure/k8s/mongodb/db-definition.yaml
echo "MongoDB Deployment has been created."
sleep 1
echo "Creating the MongoDB Service..."
sudo kubectl apply -f ./infrastructure/k8s/mongodb/db-service.yaml
echo "MongoDB Service has been created."
sleep 1
echo "Creating MongoDB Horizontal Pod Autoscaling (HPA)..."
sudo kubectl apply -f ./infrastructure/k8s/mongodb/mongodb-hpa.yaml
echo "MongoDB Horizontal Pod Autoscaling (HPA) has been created."
MONGODBSTATUS=$(sudo kubectl get pods | grep mongo-deployment | awk '{print $3}')
while [ "$MONGODBSTATUS" != "Running" ]; do
    echo "Waiting for the MongoDB Pod to be ready..."
    sleep 5
    MONGODBSTATUS=$(sudo kubectl get pods | grep mongo-deployment | awk '{print $3}')
done
echo "MongoDB Pod is ready."
# Seeding the MongoDB Database
echo "Writing MongoDB pod details to variable MONGODBPOD..."
MONGODBPOD=$(sudo kubectl get pods | grep mongo-deployment | awk '{print $1}')
echo "MongoDB Pod is: $MONGODBPOD"
sleep 1
echo "Seeding the MongoDB Database..."
sudo kubectl cp ./config/mongodbseeding/lists/team-data.json default/$MONGODBPOD:/tmp/team-data.json
sudo kubectl cp ./config/mongodbseeding/lists/player-data.json default/$MONGODBPOD:/tmp/player-data.json
sudo kubectl exec $MONGODBPOD -- ls /tmp
sudo kubectl exec $MONGODBPOD -- mongoimport --db euros-vote-db --collection team-vote --type json --jsonArray --file /tmp/team-data.json
sudo kubectl exec $MONGODBPOD -- mongoimport --db euros-vote-db --collection player-vote --type json --jsonArray --file /tmp/player-data.json
echo "MongoDB Database has been seeded."
sleep 1
# Backend Deployment
echo "Creating the Backend Deployment..."
sudo kubectl apply -f ./infrastructure/k8s/backend/backend-definition.yaml
echo "Backend Deployment has been created."
sleep 1
echo "Creating the Backend Service..."
sudo kubectl apply -f ./infrastructure/k8s/backend/backend-service.yaml
echo "Backend Service has been created."
sleep 1
echo "Creating the Backend Horizontal Pod Autoscaling (HPA)..."
sudo kubectl apply -f ./infrastructure/k8s/backend/backend-hpa.yaml
echo "Backend Horizontal Pod Autoscaling (HPA) has been created."
sleep 1
# Frontend Deployment
echo "Creating the Frontend Deployment..."
sudo kubectl apply -f ./infrastructure/k8s/frontend/frontend-definition.yaml
echo "Frontend Deployment has been created."
sleep 1
echo "Creating the Frontend Service..."
sudo kubectl apply -f ./infrastructure/k8s/frontend/frontend-service.yaml
echo "Frontend Service has been created."
sleep 1
echo "Creating the Frontend Horizontal Pod Autoscaling (HPA)..."
sudo kubectl apply -f ./infrastructure/k8s/frontend/frontend-hpa.yaml
echo "Frontend Horizontal Pod Autoscaling (HPA) has been created."
sleep 1
# Deploy Metrics Server
echo "Deploying the Metrics Server..."
sudo kubectl apply -f ./infrastructure/k8s/metrics/metrics-server-definition.yaml
echo "Metrics Server has been deployed."
# Prometheus-Grafana Deployment
echo "Creating the Prometheus-Grafana Deployment..."
echo "Adding the Prometheus Helm Repository..."
sleep 1
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
echo "Updating the Helm Repositories..."
sleep 1
helm repo update
echo "Installing the Prometheus-Grafana Stack..."
sleep 1
helm install prometheus prometheus-community/kube-prometheus-stack
echo "Prometheus-Grafana Stack has been installed."
sleep 1
# MongoDB-Exporter Deployment
echo "Creating the MongoDB-Exporter Deployment..."
helm install mongodb-exporter prometheus-community/prometheus-mongodb-exporter -f ./monitoring/prometheus/mongodb-exporter.yaml
echo "MongoDB-Exporter Deployment completed."
sleep 10
# Port Forwarding the Services
echo "Waiting for the Services to be ready..."
sleep 25
echo "Exposing the frontend service..."
sudo kubectl port-forward service/nginx 30000:80 > /dev/null 2>&1 &
sleep 5
echo "Port Forwarding the Prometheus-Server..."
sleep 5
sudo kubectl port-forward service/prometheus-kube-prometheus-prometheus 39090:9090 > /dev/null 2>&1 &
echo "Port Forwarding the Grafana Service..."
sudo kubectl port-forward service/prometheus-grafana 30001:80 > /dev/null 2>&1 &
sleep 5
echo "exposing the MongoDB-Exporter Service on port 9216..."
sudo kubectl expose service mongodb-exporter-prometheus-mongodb-exporter --type=NodePort --target-port=9216 --name=mongodb-exporter
sleep 5
echo "Port Forwarding the MongoDB-Exporter Service..."
sudo kubectl port-forward service/mongodb-exporter-prometheus-mongodb-exporter 39216:9216 > /dev/null 2>&1 &
echo "---------------------Application Start-Up has completed.---------------------"
echo "--------------------------------------------------------------------------------"
echo "---------------------Access the Application at http://localhost:30000---------------------"
echo "---------------------Access the Prometheus Dashboard at http://localhost:39090---------------------"
echo "---------------------Access the Grafana Dashboard at http://localhost:30001---------------------"
