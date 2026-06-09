import * as K8s from '@kubernetes/client-node';
const kc = new K8s.KubeConfig();
kc.loadFromDefault();
export const k8sCoreV1Api = kc.makeApiClient(K8s.CoreV1Api);
