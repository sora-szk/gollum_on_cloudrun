import { CloudRunServiceTemplateSpecContainers } from '../../.gen/providers/google/cloud-run-service'

export interface CloudRunServiceSpecConfig {
    containerConcurrency: number
    serviceAccountName: string
    timeoutSeconds: number
    containers: CloudRunServiceTemplateSpecContainers[]
}

export interface CloudRunServiceMetadataConfig {
    annotations: { [key: string]: string }
}

export interface CloudRunServiceConfig {
    spec: CloudRunServiceSpecConfig
    metadata: CloudRunServiceMetadataConfig
    authorizedInvokers: string[]
}
