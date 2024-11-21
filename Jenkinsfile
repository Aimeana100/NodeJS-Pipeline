pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "aimeana/nodejs-app"
        REGISTRY = "index.docker.io/v1/"
        REGISTRY_CREDENTIALS = 'docker-registry-credentials-id'
        SSH_CREDENTIALS_ID = 'aws-ssh-credentials-id'
        EC2_USER  = 'ubuntu'
        EC2_IP= '54.175.208.204'
    }
    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '1', numToKeepStr: '3')
    }
    
    stages {
        stage('Checkout Latest Source') {
            steps {
                git branch: 'main', url: 'https://github.com/Aimeana100/NodeJS-Pipeline.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Lint') {
            steps {
                sh 'yarn run eslint'
            }
        }
        stage('Security Scan') {
            steps {
                sh 'npm audit'
            }
        }
        stage('Build') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    dockerImage.inside {
                        // sh 'chmod +x node_modules/.bin/mocha'
                        sh 'npm test'
                    }
                }
            }
        }
        stage('Push to Docker Registry') {
            steps {
                script {
                    docker.withRegistry("https://${env.REGISTRY}", "${env.REGISTRY_CREDENTIALS}") {
                        // Tag and push the image
                        dockerImage.push()
                        dockerImage.push('latest') // Push the latest tag
                    }
                }
            }
        }
        stage("Deploy to Ec2 "){
        steps{
            script{
                sshagent(credentials: ["${env.SSH_CREDENTIALS_ID}"]) {
                    sh """
                       ssh -o StrictHostKeyChecking=no ${env.EC2_USER}@${env.EC2_IP} '
                       docker pull ${DOCKER_IMAGE}:latest &&
                       docker stop jenkins-nodejs-app || true &&
                       docker rm jenkins-nodejs-app || true &&
                       docker run -d --name jenkins-nodejs-app -p 3000:3000 ${DOCKER_IMAGE}:latest
                       '
                     """
                     }
                  }
              }
        }
        stage('Cleanup') {
            steps {
                sh 'docker rmi ${DOCKER_IMAGE} || true'
            }
        }
    }
    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Deployment and Docker push succeeded.'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}
