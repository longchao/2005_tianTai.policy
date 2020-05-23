const AUDIT_REQ = {
  "amount": {
        "<=10":     [0, 1, 0, 0, 0, 0, 0, 0],
        "10-50":    [1, 1, 0, 1, 0, 0, 0, 0],
        "50-100":   [1, 1, 0, 1, 0, 1, 0, 0],
        "100-200":  [1, 1, 0, 1, 0, 1, 1, 0],
        ">=200":    [1, 1, 0, 1, 0, 1, 1, 1],
        "kjht":     [1, 1, 0, 1, 0, 1, 1, 1],
    },
    "pay_method": {
        "kdfh":     [1, 1, 0, 1, 0, 1, 1, 1],
        "yhcd<180": [1, 1, 0, 1, 0, 1, 1, 0],
        "yhcd>=180": [1, 1, 0, 1, 0, 1, 0, 0],
        "xyz":      [1, 1, 0, 1, 0, 1, 1, 1],
        "hdfk":     [1, 1, 0, 1, 0, 1, 1, 0],
        "hd1-30":   [1, 1, 0, 1, 0, 1, 0, 0],
        "hd31-60":  [1, 1, 0, 1, 0, 0, 0, 0],
        "hd61-90":  [1, 1, 0, 0, 0, 0, 0, 0],
        "hd>=90":   [0, 1, 0, 0, 0, 0, 0, 0],
        "kjht":     [1, 1, 0, 1, 0, 1, 1, 1],
        "yh":       [1, 1, 0, 1, 0, 1, 1, 1],
    },
    "purchase_type": {
        "ddgys":    [1, 1, 0, 1, 0, 0, 0, 0],
        "lscg":     [1, 1, 0, 1, 0, 1, 1, 0],
    },
    "quality_index": {
        "gsty":     [0, 0, 0, 0, 0, 0, 0, 0],
        "zdbz":     [1, 0, 0, 0, 1, 1, 1, 0],
        "none":      [1, 0, 0, 0, 0, 1, 0, 0],
    },
    "shipping_type": {
        "gckzt":    [1, 0, 0, 0, 0, 1, 0, 0],
        "xckys":    [0, 0, 0, 0, 0, 0, 0, 0],
        "xzddd":    [1, 0, 0, 0, 0, 1, 1, 0],
        "xhymt":    [1, 0, 0, 0, 0, 1, 1, 0],
        "others":       [1, 0, 0, 0, 0, 1, 0, 0],
    },
    "delivery_time": {
        "xhtps":    [1, 0, 0, 0, 0, 0, 0, 0],
        "zt":    [1, 0, 0, 0, 0, 1, 0, 0],
        "xdcgd":     [1, 0, 0, 0, 0, 1, 0, 0],
    },
    "packing": {
        "ybz":      [0, 0, 0, 0, 0, 0, 0, 0],
        "tsyq":     [1, 0, 0, 0, 1, 1, 1, 0],
    },
    "acceptance_criteria": {
        "shys":     [1, 0, 0, 0, 0, 0, 0, 0],
        "jyys":     [1, 0, 0, 0, 0, 1, 0, 0],
        "tsyq":     [1, 0, 0, 0, 1, 1, 1, 0],
    },
    "invoicing_requirements": {
        "extra":       [1, 1, 0, 0, 0, 0, 0, 0],
    },
    "qualification": {
        "extra":       [1, 1, 1, 0, 0, 0, 0, 0],
    },
    "quality_assurance": {
        "extra":       [1, 1, 1, 1, 1, 1, 0, 0],
    },
    "liability_breach_contract": {
        "extra":       [1, 1, 1, 1, 0, 1, 1, 0],
    },
    "bid_bond":{ 
        "extra":    [1, 1, 1, 1, 0, 1, 1, 1],
    },
    "performance_bond":{
        "extra":    [1, 1, 1, 1, 0, 1, 1, 1],
    }
};

// const TEST_CASE = {
//     "amount": "21-50",
//     "pay_method": "xyz"
// }

function getAudit(c) {
    console.log('case', c);
    let auditReqFinal = [0,0,0,0,0,0,0,0,0,0];
    for(let key of Object.keys(AUDIT_REQ)){
        let c_value = c[key];
        let auditReqForThisKey = AUDIT_REQ[key];
        let req = auditReqForThisKey[c_value];
        for(let i =0;i < auditReqFinal.length;i++){
            auditReqFinal[i] = auditReqFinal[i] | req[i];
        }
    }
    return auditReqFinal;
}

function removeFromArray(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function getOptions(reqs) {
    if(reqs.length== 1){
        return Object.keys(AUDIT_REQ[reqs[0]]).map((item)=>{return `${reqs[0]}.${item}`});
    }
    let result = [];
    for(let r of reqs){
        let otherOpts =  getOptions(removeFromArray(reqs, r));
        for(let k in AUDIT_REQ[r]){
            for(let o of otherOpts){
                result.push(o + `,${r}.${k}`);
            }
        }
    }
    return result;
}

let options = getOptions(Object.keys(AUDIT_REQ));

function getCase(str){
    let result = {};
    let opts = str.split(',');
    for(let opt of opts){
        let parts = opt.split('\.');
        let key = parts[0];
        let value = parts[1];
        result[key] = value;
    }
    return result;
}

let uniqAudit = new Set();
for(let o of options){
    let c = getCase(o);
    let a = getAudit(c);
    uniqAudit.add(JSON.stringify(a));
}

console.log(uniqAudit);

