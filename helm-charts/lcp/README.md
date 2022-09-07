# lcp

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 1.22.0](https://img.shields.io/badge/AppVersion-1.22.0-informational?style=flat-square)

A Helm chart for Liferay Cloud Platform

## Requirements

Kubernetes: `>= 1.20.0-0`

**Homepage:** <https://github.com/liferaycloud/charts/>

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| LiferayCloud | <devops@liferay.cloud> | <https://github.com/liferaycloud> |

## Values

<table>
  <thead>
    <th>Key</th>
    <th>Description</th>
    <th>Type</th>
    <th>Default</th>
  </thead>
  <tbody>
    <tr>
      <td id="affinity"><a href="./values.yaml#L42">affinity</a></td>
      <td>Affinity for pod assignment</td>
      <td>
object
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
{}
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="fullnameOverride"><a href="./values.yaml#L15">fullnameOverride</a></td>
      <td>String to fully override <code>lcp.fullname</code> template</td>
      <td>
string
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
""
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="image--pullPolicy"><a href="./values.yaml#L7">image.pullPolicy</a></td>
      <td>Image pull policy (when not specified, the Global value is used)</td>
      <td>
string
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
"IfNotPresent"
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="image--repository"><a href="./values.yaml#L5">image.repository</a></td>
      <td>Image repository (when not specified, the Global value is used)</td>
      <td>
string
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
"nginx"
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="image--tag"><a href="./values.yaml#L9">image.tag</a></td>
      <td>Image tag (immutable tags are recommended)</td>
      <td>
string
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
""
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="imagePullSecrets"><a href="./values.yaml#L11">imagePullSecrets</a></td>
      <td>Docker registry secret names as an array</td>
      <td>
list
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
[]
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="nameOverride"><a href="./values.yaml#L13">nameOverride</a></td>
      <td>String to partially override <code>lcp-help.fullname</code> template (will maintain the release name)</td>
      <td>
string
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
""
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="nodeSelector"><a href="./values.yaml#L38">nodeSelector</a></td>
      <td>Node labels for pod assignment</td>
      <td>
object
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
{}
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="podAnnotations"><a href="./values.yaml#L17">podAnnotations</a></td>
      <td>Additional annotations to apply to the pod</td>
      <td>
object
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
{}
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="podSecurityContext"><a href="./values.yaml#L19">podSecurityContext</a></td>
      <td>Pod Security Context</td>
      <td>
object
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
{}
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="replicaCount"><a href="./values.yaml#L2">replicaCount</a></td>
      <td>The number of provisioning pods to run</td>
      <td>
int
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
1
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="resources"><a href="./values.yaml#L30">resources</a></td>
      <td>The resources limits and requests for the container</td>
      <td>
object
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
{
  "limits": {
    "cpu": "100m",
    "memory": "128Mi"
  },
  "requests": {
    "cpu": "100m",
    "memory": "128Mi"
  }
}
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="securityContext"><a href="./values.yaml#L21">securityContext</a></td>
      <td>Security context for the container</td>
      <td>
object
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
{}
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="service--annotations"><a href="./values.yaml#L24">service.annotations</a></td>
      <td>Service annotations</td>
      <td>
object
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
{}
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="service--port"><a href="./values.yaml#L28">service.port</a></td>
      <td>Http client port</td>
      <td>
int
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
80
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="service--type"><a href="./values.yaml#L26">service.type</a></td>
      <td>Kubernetes Service type</td>
      <td>
string
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
"ClusterIP"
</pre>
</div>
      </td>
    </tr>
    <tr>
      <td id="tolerations"><a href="./values.yaml#L40">tolerations</a></td>
      <td>Tolerations for pod assignment</td>
      <td>
list
</td>
      <td>
        <div style="max-width: 300px;"><pre lang="json">
[]
</pre>
</div>
      </td>
    </tr>
  </tbody>
</table>

