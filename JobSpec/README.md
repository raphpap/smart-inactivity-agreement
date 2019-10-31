# Job Spec

Here is the spec of the job that must be created in the Operator's Portal in order to fetch a user's last activity from the Node Adapter.

*Beforehand, you must have created a new bridge, named `fbexternaladapter`, pointing towards the deployed `External Adapter`.


```
{
	"initiators": [
		{
			"type": "runlog",
			"params": {
				"address": "<<insert your DEPLOYED_ORACLE_ADDRESS>>"
			}
		}
	],
	"tasks": [
		{
			"type": "fbexternaladapter",
			"confirmations": null,
			"params": {}
		},
		{
			"type": "copy",
			"confirmations": null,
			"params": {}
		},
		{
			"type": "ethuint256",
			"confirmations": null,
			"params": {}
		},
		{
			"type": "ethtx",
			"confirmations": null,
			"params": {}
		}
	],
	"startAt": null,
	"endAt": null
}
```
