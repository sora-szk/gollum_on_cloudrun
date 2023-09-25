import { CloudRunServiceConfig } from './entities/cloudRun'

const PROJECT_ID = process.env.PROJECT_ID as string
const PROJECT_NAME = process.env.PROJECT_NAME as string
const SERVICE_ACCOUNT_NAME = process.env.SERVICE_ACCOUNT_NAME as string
const SERVICE_ACCOUNT_FILE_NAME = process.env.SERVICE_ACCOUNT_FILE_NAME as string

const _gollumAppCloudRunConfig: CloudRunServiceConfig = {
    spec: {
        serviceAccountName: SERVICE_ACCOUNT_NAME,
        containerConcurrency: 10,
        timeoutSeconds: 100,
        containers: [
            {
                image: `asia.gcr.io/${PROJECT_ID}/${PROJECT_NAME}/app`,
                ports: [
                    {
                        name: 'http1',
                        containerPort: 4567,
                    },
                ],
                resources: {
                    requests: {
                        cpu: '500m',
                        memory: '500Mi',
                    },
                    limits: {
                        cpu: '2000m',
                        memory: '2Gi',
                    },
                },
            },
        ],
    },
    metadata: {
        annotations: {
            'autoscaling.knative.dev/maxScale': '1',
            'autoscaling.knative.dev/minScale': '0',
            'run.googleapis.com/execution-environment': 'gen2',
            'run.googleapis.com/cpu-throttling': 'true',
        },
    },
    authorizedInvokers: ['allUsers'],
}

export = {
    serviceAccountJsonFileName: SERVICE_ACCOUNT_FILE_NAME,
    cloudRun: {
        gollumApp: _gollumAppCloudRunConfig,
    },
}
