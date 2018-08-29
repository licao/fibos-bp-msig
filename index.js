var FIBOS = require('fibos.js');
var httpEndpoint = "http://ln-rpc.fibos.io:8870";
var chainId = '6aa7bd33b6b45192465afa3553dedb531acaaff8928cf64b70bd4c5e49b7ec6a';

var producername = ""; //用户名称
var privatekey = ""; //私钥



//联系
var fibos = FIBOS({
	chainId: chainId,
	keyProvider: privatekey,
	httpEndpoint: httpEndpoint,
	logger: {
		log: null,
		error: null
	}
});
var ctx = fibos.contractSync("eosio.msig");



console.notice("---------connect to " + httpEndpoint + "----welcome " + producername + "--------");
choice();

//提案列表
function approvals() {
	var a = fibos.getTableRowsSync(true, "eosio.msig", "londonbpfib5", "approvals");
	console.log(a)
	a.rows.forEach(function(d) {
		console.notice('proposal_name: ', d.proposal_name);
		console.notice('approve / unapprove : ' + d.provided_approvals.length + "/" + (d.requested_approvals.length + d.provided_approvals.length));
		console.notice('requested:');
		d.requested_approvals.forEach(function(dd, index) {
			console.log(index + 1, '. actor: ', dd.actor, 'permission: ', dd.permission);
		});

		console.notice('approve:');
		d.provided_approvals.forEach(function(dd, index) {
			console.log(index + 1, '. actor: ', dd.actor, 'permission: ', dd.permission);
		});
	});
}

function approve() {
	var proposal_name = console.readLine("proposal_name:");
	if (!proposal_name) {
		console.notice('no proposal_name');
		return;
	}
	var ctx = fibos.contractSync("eosio.msig");
	var a = ctx.approveSync({
		"proposer": "londonbpfib5",
		"proposal_name": proposal_name,
		"level": {
			"actor": producername,
			"permission": "active"
		}
	}, {
		"authorization": producername
	})
	approvals();
}

function choice() {
	console.notice("----------start------------")
	console.log("1.approvals list \n2.approve");
	var index = Number(console.readLine("choice:"));

	switch (index) {
		case 1:
			approvals();
			break;
		case 2:
			approve();
			break;

	}
	console.notice("------------end------------")
	choice();
}
console.notice("--------------------------------------Account end--------------------------------------");