const wmic = require("./../lib/wmic");
const UInt32 = require("wmic-js").Types.UInt32;

// Check registry key access
const HKEY_LOCAL_MACHINE = new UInt32(2147483650);

const keyPath = "Software\\Microsoft\\SystemCertificates\\MY\\Certificates";

let regProv = wmic.func().class("StdRegProv");

regProv
	.call("EnumKey", HKEY_LOCAL_MACHINE, keyPath)
	.then(result => {
		for (let i = 0; i < result.sNames.length; i++) {
			const thumbprint = result.sNames[i];
			let subKeyPath = `${keyPath}\\${thumbprint}`;
			console.log("subKeyPath");
			console.log(subKeyPath);

			regProv
				.call("GetBinaryValue", HKEY_LOCAL_MACHINE, subKeyPath, "Blob")
				.then(result => {
					if (
						result.ReturnValue === 0 &&
						result.uValue &&
						result.uValue.length > 0
					) {
						console.log("result.uValue");
						console.log(result.uValue);
						var base64Image = new Buffer(
							result.uValue,
							"binary"
						).toString("base64");

						// var base64Image = Buffer.from(
						//     result.uValue,
						//     "binary"
						// ).toString("base64");

						console.log("FINAL RESULT", base64Image);
						console.log(typeof result.uValue);
					}
				})
				.catch(err => {
					console.log("err", err);
				});
		}
	})
	.catch(err => {
		console.log("err");
		console.log(err);
	});
