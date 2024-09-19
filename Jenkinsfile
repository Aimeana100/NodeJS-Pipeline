pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "aimeana/nodejs-app:1"
	    BUILD_ID = "1"
    }
    stages {
 stage('Checkout Latest Source') {
      steps {
        git branch: 'main', url: 'https://github.com/Aimeana100/NodeJS-Pipeline.git'
      }
 }
        stage('Build') {
            steps {
                script {
                    dockerImage = docker.build("${env.DOCKER_IMAGE}:${env.BUILD_ID}")
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    dockerImage.inside {
                         // Set execute permissions for node_modules/.bin
                        sh 'chmod +x node_modules/.bin/mocha'
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                  
                      kubeconfig(credentialsId: 'JenkinsCredentials', serverUrl: 'http://127.0.0.1:32769') {
                        sh 'kubectl apply -f kubernetes-deployment.yml'
                    }
                }
            }
        }
    }
}
