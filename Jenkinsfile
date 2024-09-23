pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "aimeana/nodejs-app"
        REGISTRY = "https://hub.docker.com"
        REGISTRY_CREDENTIALS = 'docker-registry-credentials-id'
    }
    options {
        timestamps()
        retry(2)
        timeout(time: 30, unit: 'MINUTES')
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
                        dockerImage.push() // Push the versioned image
                        dockerImage.push('latest') // Push the latest tag
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
        stage('Post-Deployment Tests') {
            steps {
                sh 'curl -f http://localhost:8080/health'
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
