
# Three Tier Web App - K8s Demonstration
A simple voting app to vote for your favourite team and player in the Euros 2024 tournament. Built with react, express and MongoDB. Hosted on K8s in Minikube. Designed to be ran locally.

Clone this repo and you can:
1. Build the app with one install/run script.
2. Run load tests using [k6](https://k6.io)
3. View the cluster performance metrics in [Grafana](https://grafana.com)
4. Experience the power of K8s autoscaling in action!


<img width="1313" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/9eea2857-f144-4b8e-87e1-d6a61239e7eb">

## Prerequisites
|Service  | Requirement | Link |
|--|--|--|
| **Minikube** | Minikube allows you to run a kubernetes cluster using docker containers inside your local environment. This is the chosen tool for hosting the application. |https://minikube.sigs.k8s.io/docs/start/?arch=%2Fmacos%2Fx86-64%2Fstable%2Fbinary+download|
| **Helm** | Helm is a package manager for kubernetes environments. It is used in this installation to install Prometheus & Grafana, the monitoring tool of choice. | https://helm.sh/docs/intro/install/ |
| **Docker** | Docker is used to run the underlying containers that Minikube is launched on. Without the docker engine, minikube will be unable to start. You can choose to install Docker Desktop, or just the Docker Engine |https://docs.docker.com/engine/install/ |
|**K6**|K6 is a Load-Testing tool designed for kubernetes, built by Grafana Labs. It is used in this application to simulate load on the pods.|https://grafana.com/oss/k6/?src=k6io|


## Setup & Instructions

### 1. Check Pre-requisites
Ensure that all the pre-requisites are installed. Links to download instructions are provided above. 
### 2. Clone this Repo
Clone this repo using the command:

    git clone https://github.com/jonathanjhunt/euros-vote-app

### 3. Start the application
Navigate to the folder of the cloned repo and run the command:

    sh start_app.sh

<img width="1060" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/cdd5ef08-f1a6-4fcc-967e-4929304a7b0e">

The startup script will:

1. Check that pre-requisites are installed
2. Spin up the minikube cluster
3. Apply the kubernetes manifests
4. Seed the mongoDB database
5. Install the Prometheus-Grafana stack with helm
6. Expose the Frontend and Grafana Service so they are accessible via localhost

### 4. Check the UI

Once the script has completed, the application should be accessible at:
**Front-End**: [http://localhost:30000](http://localhost:30000)
<img width="763" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/110b1582-c134-4357-9173-b250410394b1">

### 5. Access Grafana and Configure the Dashboard

Grafana should be accessible via:
**Grafana**: [http://localhost:30001](http://localhost:30001)

<img width="469" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/45c4ac5d-90ea-42c9-8a0a-47e8731b57b3">

| Username | Password|
|--|--|
|**admin**  | **prom-operator** |



Once you have logged in:
1. Select Dashboards on the left panel
2. Click the blue 'New' button
3. Select Import

<img width="1453" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/5502c2a7-7466-474f-a0f1-bb46c9a7eae3">


4. In the cloned github repo, copy the contents from the JSON file found under 
		`/monitoring/grafana/euros-dashboard.json`
5. Paste in the box under *Import via dashboard JSON model*
6. Select Load
7. Select Import
### Run K6 Load Test

To simulate load through the kubernetes cluster, I have used K6. K6 is a tool built by grafana-labs that can create virtual users and send http requests to endpoints in order to simulate real load on the system. This can help demonstrate the autoscaling capabilities that have been configured within this kubernetes app. 

Before beginning the load test, take a look at the number of pods running on the system, as well as the average cpu load per pod. 

<img width="1184" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/cf676ecc-de7c-40ff-8865-e0d84cddbab5">

To begin the load test, make sure K6 is installed, and then run:

    k6 run load-testing/k6/full-ramp-load-test.js
<img width="1427" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/4dd23bbb-3411-4f84-b6d1-45fd6bb74eeb">

The load test will begin, ramping up the number of virtual users. This mocks real activity on the web-app and gives the system time to scale in and out as required. 

As the number of VU's increases, check Grafana to see the average CPU of the pods and the number of Pods within the deployment. 

<img width="1172" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/6897e32d-7fde-4e54-8e54-6fd70dafec40">

Thats it! Kubernetes Pods within the cluster scale up and down to accomodate for additional load on the system. 

### Known Issues / Caveats

- The front end pods are exposed using port forwarding with service types **nodePort**. This is due to known issues with minikube tunnel preventing connectivity to the service type **Load Balancer**. This means that although the frontend pods can scale, all network traffic goes through to only one pod. This puts a bottle neck on the amount of load that can be applied to the system. Additionally for this reason, it is not advised that this code is deployed to a production environment. **This code is only designed to be run locally or in a development environment with minikube**

### Terminating the Application and Cluster
To shut down the application and the minikube cluster, simply run:

    minikube delete

<img width="650" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/99230f95-f8e6-4231-8837-7fa3e42d4782">

## Architecture
<img width="209" alt="architecture" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/db171efd-e9b1-41af-a7fd-ce46c91c27ba">


### Kubernetes Configuration
The Kubernetes configuration for this application has been seperated into 3 seperate files for each tier of the application:

#### Deployment Definitions
<img width="581" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/3c61fbc2-406d-4679-b002-eaedc11d4fd6">

The deployment definition files for each tier of the application follow a similiar template. The deployment defines the application tiers information, such as image used, nmber of pods, tags and resource requirements/requests.

| key | definition |
|--|--|
| matchLabels | Defines the tags that the service yaml will use to know what pods to attatch to |
| replicas | base number of pods for the deployment  |
| image | the image that it pulls from dockerhub to run on the pod |
| imagePullPolicy | define wether you want to always pull the latest image when building a new pod |
| containerPort | the port that the application exposes itself on |
| resources:requests | the minimum hardware resources that are assigned to a pod |
| resources:limits | the maximum hardware resources that a pod can consume |

#### Service Definitions

<img width="510" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/f16294dd-fc4e-4274-8527-22567e59c7d5">

The service definition file acts as the network connection between pods. Services are attached to pods and allows connectivity between different applications, as well as exposing connectivity to the internet. 

| key | definitions |
|--|--|
|selector/app  | Defines tags that pods must match to attach to this service |
| selector/tier | Defines tags that pods must match to attach to this service |
| port | Port that the application exposes itself on |
| nodePort  | The port that kubernetes exposes when using type nodePort |
| type | Define the type of load balancer, ClusterIP (pod to pod communication), LoadBalancer (preferred approach for external connection, doesnt work well with minikube), nodePort (Easiest method for exposing in local development)|


#### HPA Definition

The HPA (horizontal pod autoscaling) definition file configurs the pods to autoscale based on the average load on a pod. This allows the three tier-application to scale in and out based on usage. 

<img width="454" alt="image" src="https://github.com/jonathanjhunt/euros-vote-app/assets/70526178/7e021766-e278-4de0-99d1-ee3ac0a3ff3f">

| key | definition |
|--|--|
| scaleTargetRef:name  | specifies which pods to attach the scale policy to |
| minReplicas | minimum number of pods for the application labelled "frontend"  |
| maxReplicas  | maximum number of pods for the application labelled "frontend"   |
| targetCPUUtilizationPercentage | the target CPU for pods to remain at. |



## 
