﻿"use strict";
var chai = require("chai");
var expect = chai.expect;

var sinon = require("sinon");

var base64 = require("Base64");
var crypto = new (require("@peculiar/webcrypto").Crypto)();

var mocks = require("./stubs");
var DWA = require("../lib/dwa");
var DynamicsWebApi = require("../lib/dynamics-web-api");
var dynamicsWebApiTest = new DynamicsWebApi({ webApiVersion: "8.2" });

var xhrModule = require("../lib/requests/xhr");
var Utility = require("../lib/utilities/Utility");
Utility.downloadChunkSize = 15;

describe("xhr -", function () {
	describe("dynamicsWebApi.create -", function () {
		describe("basic", function () {
			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest
					.create(mocks.data.testEntity, "tests")
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});

				var response = mocks.responses.createReturnId;
				this.requests[0].respond(response.status, response.responseHeaders);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("POST");
			});

			it("sends the right data", function () {
				expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
			});

			it("does not have Prefer header", function () {
				expect(this.requests[0].requestHeaders["Prefer"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject).to.deep.equal(mocks.data.testEntityId);
			});
		});

		describe("crm error", function () {
			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest
					.create(mocks.data.testEntity, "tests")
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});

				var response = mocks.responses.upsertPreventCreateResponse;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("POST");
			});

			it("sends the right data", function () {
				expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
			});

			it("does not have Prefer header", function () {
				expect(this.requests[0].requestHeaders["Prefer"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject.message).to.eql("message");
				expect(responseObject.status).to.eql(404);
				expect(responseObject.statusText).to.eql("Not Found");
				expect(responseObject.headers).to.eql({ dummy: "header" });
			});
		});

		describe("unexpected error", function () {
			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest
					.create(mocks.data.testEntity, "tests")
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});

				var response = mocks.responses.upsertPreventCreateResponse;
				this.requests[0].respond(response.status, response.responseHeaders);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("POST");
			});

			it("sends the right data", function () {
				expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
			});

			it("does not have Prefer header", function () {
				expect(this.requests[0].requestHeaders["Prefer"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject.message).to.eql("Unexpected Error");
				expect(responseObject.status).to.eql(404);
				expect(responseObject.statusText).to.eql("Not Found");
				expect(responseObject.headers).to.eql({ dummy: "header" });
			});
		});

		describe("not crm error", function () {
			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest
					.create(mocks.data.testEntity, "tests")
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});

				var response = mocks.responses.upsertPreventCreateResponse;
				this.requests[0].respond(response.status, response.responseHeaders, "something");
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("POST");
			});

			it("sends the right data", function () {
				expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
			});

			it("does not have Prefer header", function () {
				expect(this.requests[0].requestHeaders["Prefer"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				var error = new Error("something");
				error.status = 404;
				error.statusText = "Not Found";

				expect(responseObject.message).to.equal(error.message);
				expect(responseObject.status).to.equal(error.status);
				expect(responseObject.statusText).to.equal(error.statusText);
			});
		});
	});

	describe("dynamicsWebApi.executeBatch - ", function () {
		describe("update / delete - returns an error", function () {
			var responseObject;
			var rBody = mocks.data.batchUpdateDelete;
			var rBodys = rBody.split("\n");
			var checkBody = "";
			for (var i = 0; i < rBodys.length; i++) {
				checkBody += rBodys[i];
			}
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest.startBatch();

				dynamicsWebApiTest.update(mocks.data.testEntityId2, "records", { firstname: "Test", lastname: "Batch!" });
				dynamicsWebApiTest.deleteRecord(mocks.data.testEntityId2, "records", "firstname");

				dynamicsWebApiTest
					.executeBatch()
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});

				var response = mocks.responses.batchError;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + "$batch");
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("POST");
			});

			it("sends the right data", function () {
				function filterBody(body) {
					body = body.replace(/dwa_batch_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "dwa_batch_XXX");
					body = body.replace(/changeset_[\d\w]{8}-[\d\w]{4}-[\d\w]{4}-[\d\w]{4}-[\d\w]{12}/g, "changeset_XXX");
					var bodys = body.split("\n");

					var resultBody = "";
					for (var i = 0; i < bodys.length; i++) {
						resultBody += bodys[i];
					}
					return resultBody;
				}

				expect(filterBody(this.requests[0].requestBody)).to.deep.equal(checkBody);
			});

			it("does not have Prefer header", function () {
				expect(this.requests[0].requestHeaders["Prefer"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject.length).to.be.eq(1);

				expect(responseObject[0].error).to.deep.equal({
					code: "0x0",
					message: "error",
					innererror: { message: "error", type: "Microsoft.Crm.CrmHttpException", stacktrace: "stack" },
				});

				expect(responseObject[0].status).to.equal(400);
				expect(responseObject[0].statusMessage).to.equal("Bad Request");
				expect(responseObject[0].statusText).to.equal("Bad Request");
			});
		});
	});

	describe("return representation", function () {
		var responseObject;
		before(function (done) {
			global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
			var requests = (this.requests = []);

			global.XMLHttpRequest.onCreate = function (xhr) {
				requests.push(xhr);
			};

			dynamicsWebApiTest
				.create(mocks.data.testEntity, "tests", DWA.Prefer.ReturnRepresentation)
				.then(function (object) {
					responseObject = object;
					done();
				})
				.catch(function (object) {
					responseObject = object;
					done();
				});

			var response = mocks.responses.createReturnRepresentation;
			this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
		});

		it("sends the request to the right end point", function () {
			expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
		});

		after(function () {
			global.XMLHttpRequest.restore();
			global.XMLHttpRequest = null;
		});

		it("uses the correct method", function () {
			expect(this.requests[0].method).to.equal("POST");
		});

		it("sends the right data", function () {
			expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
		});

		it("sends the Prefer header", function () {
			expect(this.requests[0].requestHeaders["Prefer"]).to.equal(DWA.Prefer.ReturnRepresentation);
		});

		it("returns the correct response", function () {
			expect(responseObject).to.deep.equal(mocks.data.testEntity);
		});
	});
	describe("dynamicsWebApi.updateRequest -", function () {
		describe("change if-match header", function () {
			var dwaRequest = {
				id: mocks.data.testEntityId,
				collection: "tests",
				entity: mocks.data.testEntity,
			};

			var responseObject;
			var responseObject2;
			var responseObject3;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dwaRequest.select = ["fullname", "subject"];
				dwaRequest.ifmatch = "match";
				dwaRequest.returnRepresentation = false;
				dynamicsWebApiTest
					.updateRequest(dwaRequest)
					.then(function (object) {
						responseObject = object;
					})
					.catch(function (object) {
						responseObject = object;
					});

				var response = mocks.responses.basicEmptyResponseSuccess;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

				dwaRequest.returnRepresentation = true;

				dynamicsWebApiTest
					.updateRequest(dwaRequest)
					.then(function (object) {
						responseObject2 = object;
					})
					.catch(function (object) {
						responseObject2 = object;
					});

				var response2 = mocks.responses.upsertPreventUpdateResponse;
				this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);

				dynamicsWebApiTest
					.updateRequest(dwaRequest)
					.then(function (object) {
						responseObject3 = object;
						done();
					})
					.catch(function (object) {
						responseObject3 = object;
						done();
					});

				var response3 = mocks.responses.upsertPreventCreateResponse;
				this.requests[2].respond(response3.status, response3.responseHeaders, response3.responseText);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$select=fullname,subject");
				expect(this.requests[1].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$select=fullname,subject");
				expect(this.requests[2].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$select=fullname,subject");
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("PATCH");
				expect(this.requests[1].method).to.equal("PATCH");
				expect(this.requests[2].method).to.equal("PATCH");
			});

			it("sends the right data", function () {
				expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
				expect(JSON.parse(this.requests[1].requestBody)).to.deep.equal(mocks.data.testEntity);
				expect(JSON.parse(this.requests[2].requestBody)).to.deep.equal(mocks.data.testEntity);
			});

			it("sends the Prefer header", function () {
				expect(this.requests[0].requestHeaders["Prefer"]).to.be.undefined;
				expect(this.requests[1].requestHeaders["Prefer"]).to.equal(DWA.Prefer.ReturnRepresentation);
				expect(this.requests[2].requestHeaders["Prefer"]).to.equal(DWA.Prefer.ReturnRepresentation);
			});

			it("sends the right If-Match header", function () {
				expect(this.requests[0].requestHeaders["If-Match"]).to.equal("match");
				expect(this.requests[1].requestHeaders["If-Match"]).to.equal("match");
				expect(this.requests[2].requestHeaders["If-Match"]).to.equal("match");
			});

			it("returns the correct response", function () {
				expect(responseObject).to.equal(true);
				expect(responseObject2).to.equal(false);
				expect(responseObject3.status).to.equal(404);
			});
		});
	});

	describe("dynamicsWebApi.retrieveRequest -", function () {
		describe("basic", function () {
			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				var dwaRequest = {
					id: mocks.data.testEntityId,
					collection: "tests",
					expand: [{ property: "prop" }],
				};

				dynamicsWebApiTest
					.retrieveRequest(dwaRequest)
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});

				var response = mocks.responses.response200;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$expand=prop");
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("GET");
			});

			it("does not send data", function () {
				expect(this.requests[0].requestBody).to.be.undefined;
			});

			it("sends the correct If-Match header", function () {
				expect(this.requests[0].requestHeaders["If-Match"]).to.be.undefined;
			});

			it("sends the correct MSCRMCallerID header", function () {
				expect(this.requests[0].requestHeaders["MSCRMCallerID"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject).to.deep.equal(mocks.data.testEntity);
			});
		});
	});

	describe("dynamicsWebApi.constructor -", function () {
		describe("authentication", function () {
			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				var dwaRequest = {
					id: mocks.data.testEntityId,
					collection: "tests",
					expand: [{ property: "prop" }],
				};

				var getToken = function (callback) {
					callback({ accessToken: "token001" });
				};

				var dynamicsWebApiAuth = new DynamicsWebApi({
					webApiVersion: "8.2",
					onTokenRefresh: getToken,
				});

				dynamicsWebApiAuth
					.retrieveRequest(dwaRequest)
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});

				var response = mocks.responses.response200;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + "?$expand=prop");
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("GET");
			});

			it("does not send data", function () {
				expect(this.requests[0].requestBody).to.be.undefined;
			});

			it("sends the correct Authorization header", function () {
				expect(this.requests[0].requestHeaders["Authorization"]).to.equal("Bearer token001");
			});

			it("returns the correct response", function () {
				expect(responseObject).to.deep.equal(mocks.data.testEntity);
			});
		});
	});

	describe("dynamicsWebApi.retrieveMultiple -", function () {
		describe("basic", function () {
			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest
					.retrieveMultiple("tests")
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});

				var response = mocks.responses.multipleResponse;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("GET");
			});

			it("does not send data", function () {
				expect(this.requests[0].requestBody).to.be.undefined;
			});

			it("does not send If-Match header", function () {
				expect(this.requests[0].requestHeaders["If-Match"]).to.be.undefined;
			});

			it("does not send MSCRMCallerID header", function () {
				expect(this.requests[0].requestHeaders["MSCRMCallerID"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject).to.deep.equal(mocks.responses.multiple());
			});
		});

		describe("select", function () {
			var responseObject;
			var responseObject2;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest
					.retrieveMultiple("tests", ["fullname"])
					.then(function (object) {
						responseObject = object;
					})
					.catch(function (object) {
						responseObject = object;
					});

				var response = mocks.responses.multipleResponse;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

				dynamicsWebApiTest
					.retrieveMultiple("tests", ["fullname", "subject"])
					.then(function (object) {
						responseObject2 = object;
						done();
					})
					.catch(function (object) {
						responseObject2 = object;
						done();
					});

				var response2 = mocks.responses.multipleResponse;
				this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$select=fullname");
				expect(this.requests[1].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$select=fullname,subject");
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("GET");
				expect(this.requests[1].method).to.equal("GET");
			});

			it("does not send data", function () {
				expect(this.requests[0].requestBody).to.be.undefined;
				expect(this.requests[1].requestBody).to.be.undefined;
			});

			it("does not send If-Match header", function () {
				expect(this.requests[0].requestHeaders["If-Match"]).to.be.undefined;
				expect(this.requests[1].requestHeaders["If-Match"]).to.be.undefined;
			});

			it("does not send MSCRMCallerID header", function () {
				expect(this.requests[0].requestHeaders["MSCRMCallerID"]).to.be.undefined;
				expect(this.requests[1].requestHeaders["MSCRMCallerID"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject).to.deep.equal(mocks.responses.multiple());
				expect(responseObject2).to.deep.equal(mocks.responses.multiple());
			});
		});

		describe("filter", function () {
			var responseObject;
			var responseObject2;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest
					.retrieveMultiple("tests", null, "name eq 'name'")
					.then(function (object) {
						responseObject = object;
					})
					.catch(function (object) {
						responseObject = object;
					});

				var response = mocks.responses.multipleResponse;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

				dynamicsWebApiTest
					.retrieveMultiple("tests", ["fullname"], "name eq 'name'")
					.then(function (object) {
						responseObject2 = object;
						done();
					})
					.catch(function (object) {
						responseObject2 = object;
						done();
					});

				var response2 = mocks.responses.multipleResponse;
				this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$filter=name%20eq%20'name'");
				expect(this.requests[1].url).to.equal(
					mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, "") + "?$select=fullname&$filter=name%20eq%20'name'"
				);
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("GET");
				expect(this.requests[1].method).to.equal("GET");
			});

			it("does not send data", function () {
				expect(this.requests[0].requestBody).to.be.undefined;
				expect(this.requests[1].requestBody).to.be.undefined;
			});

			it("does not send If-Match header", function () {
				expect(this.requests[0].requestHeaders["If-Match"]).to.be.undefined;
				expect(this.requests[1].requestHeaders["If-Match"]).to.be.undefined;
			});

			it("does not send MSCRMCallerID header", function () {
				expect(this.requests[0].requestHeaders["MSCRMCallerID"]).to.be.undefined;
				expect(this.requests[1].requestHeaders["MSCRMCallerID"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject).to.deep.equal(mocks.responses.multiple());
				expect(responseObject2).to.deep.equal(mocks.responses.multiple());
			});
		});

		describe("next page link", function () {
			var responseObject;
			var responseObject2;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				dynamicsWebApiTest
					.retrieveMultiple("tests")
					.then(function (object) {
						responseObject = object;
					})
					.catch(function (object) {
						responseObject = object;
					});

				var response = mocks.responses.multipleWithLinkResponse;
				this.requests[0].respond(response.status, response.responseHeaders, response.responseText);

				dynamicsWebApiTest
					.retrieveMultiple(null, null, null, mocks.responses.multipleWithLink().oDataNextLink)
					.then(function (object) {
						responseObject2 = object;
						done();
					})
					.catch(function (object) {
						responseObject2 = object;
						done();
					});

				var response2 = mocks.responses.multipleResponse;
				this.requests[1].respond(response2.status, response2.responseHeaders, response2.responseText);
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
				expect(this.requests[1].url).to.equal(mocks.responses.multipleWithLink().oDataNextLink);
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("GET");
				expect(this.requests[1].method).to.equal("GET");
			});

			it("does not send data", function () {
				expect(this.requests[0].requestBody).to.be.undefined;
				expect(this.requests[1].requestBody).to.be.undefined;
			});

			it("does not send If-Match header", function () {
				expect(this.requests[0].requestHeaders["If-Match"]).to.be.undefined;
				expect(this.requests[1].requestHeaders["If-Match"]).to.be.undefined;
			});

			it("does not send MSCRMCallerID header", function () {
				expect(this.requests[0].requestHeaders["MSCRMCallerID"]).to.be.undefined;
				expect(this.requests[1].requestHeaders["MSCRMCallerID"]).to.be.undefined;
			});

			it("returns the correct response", function () {
				expect(responseObject).to.deep.equal(mocks.responses.multipleWithLink());
				expect(responseObject2).to.deep.equal(mocks.responses.multiple());
			});
		});
	});

	describe("request error", function () {
		var responseObject;
		before(function (done) {
			global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
			var requests = (this.requests = []);

			global.XMLHttpRequest.onCreate = function (xhr) {
				requests.push(xhr);
			};

			dynamicsWebApiTest
				.create(mocks.data.testEntity, "tests")
				.then(function (object) {
					responseObject = object;
					done();
				})
				.catch(function (object) {
					responseObject = object;
					done();
				});

			this.requests[0].onerror();
		});

		after(function () {
			global.XMLHttpRequest.restore();
			global.XMLHttpRequest = null;
		});

		it("sends the request to the right end point", function () {
			expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
		});

		it("uses the correct method", function () {
			expect(this.requests[0].method).to.equal("POST");
		});

		it("sends the right data", function () {
			expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
		});

		it("does not have Prefer header", function () {
			expect(this.requests[0].requestHeaders["Prefer"]).to.be.undefined;
		});

		it("returns the correct response", function () {
			expect(responseObject.message).to.eql("Network Error");
			expect(responseObject.status).to.eql(0);
			expect(responseObject.statusText).to.eql("");
			expect(responseObject.headers).to.eql({});
		});
	});

	describe("request timeout", function () {
		var responseObject;
		before(function (done) {
			global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
			var requests = (this.requests = []);

			global.XMLHttpRequest.onCreate = function (xhr) {
				requests.push(xhr);
			};

			var dynamicsWebApiTimeout = new DynamicsWebApi({ webApiVersion: "8.2", timeout: 100 });

			dynamicsWebApiTimeout
				.create(mocks.data.testEntity, "tests")
				.then(function (object) {
					responseObject = object;
					done();
				})
				.catch(function (object) {
					responseObject = object;
					done();
				});

			this.requests[0].ontimeout();
		});

		after(function () {
			global.XMLHttpRequest.restore();
			global.XMLHttpRequest = null;
		});

		it("sends the request to the right end point", function () {
			expect(this.requests[0].url).to.equal(mocks.webApiUrl + mocks.responses.collectionUrl.replace(/^\/|\/$/g, ""));
		});

		it("uses the correct method", function () {
			expect(this.requests[0].method).to.equal("POST");
		});

		it("sends the right data", function () {
			expect(JSON.parse(this.requests[0].requestBody)).to.deep.equal(mocks.data.testEntity);
		});

		it("does not have Prefer header", function () {
			expect(this.requests[0].requestHeaders["Prefer"]).to.be.undefined;
		});

		it("returns the correct response", function () {
			expect(responseObject.message).to.eql("Request Timed Out");
			expect(responseObject.status).to.eql(0);
			expect(responseObject.statusText).to.eql("");
			expect(responseObject.headers).to.eql({});
		});
	});

	describe("dynamicsWebApi.uploadFile -", function () {
		describe("file upload with 2 chunks", function () {
			var dwaRequest = {
				key: mocks.data.testEntityId,
				collection: "tests",
				fileName: "test.json",
				fieldName: "dwa_file",
				data: Buffer.from("Welcome to DynamicsWebApi!", "utf-8"),
			};

			var beginResponse = mocks.responses.uploadFileBeginResponse;
			var response1 = mocks.responses.uploadFile1stResponse;

			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

				var requests = (this.requests = []);

				var i = 0;
				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				xhrModule.afterSendEvent = function () {
					switch (i) {
						case 0:
							requests[i].respond(beginResponse.status, beginResponse.responseHeaders);
							break;
						default:
							requests[i].respond(response1.status);
							break;
					}

					i++;
				};

				global.window = {
					btoa: base64.btoa,
					atob: base64.atob,
					crypto: crypto,
				};

				dynamicsWebApiTest
					.uploadFile(dwaRequest)
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
				global.window = null;
				xhrModule.afterSendEvent = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(
					mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.fieldName}?x-ms-file-name=${dwaRequest.fileName}`
				);
				expect(this.requests[1].url).to.equal(beginResponse.responseHeaders.Location);
				expect(this.requests[2].url).to.equal(beginResponse.responseHeaders.Location);
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("PATCH");
				expect(this.requests[1].method).to.equal("PATCH");
				expect(this.requests[2].method).to.equal("PATCH");
			});

			it("sends data", function () {
				expect(this.requests[0].requestBody).to.be.undefined;
				expect(this.requests[1].requestBody).to.deep.eq(
					mocks.utils.toTypedArray(dwaRequest.data.slice(0, beginResponse.responseHeaders["x-ms-chunk-size"]))
				);
				expect(this.requests[2].requestBody).to.deep.eq(
					mocks.utils.toTypedArray(dwaRequest.data.slice(beginResponse.responseHeaders["x-ms-chunk-size"], dwaRequest.data.length))
				);
			});

			it("sends correct headers", function () {
				expect(this.requests[0].requestHeaders["x-ms-transfer-mode"]).to.be.eq("chunked");
				expect(this.requests[1].requestHeaders["Content-Range"]).to.be.eq(
					`bytes 0-${beginResponse.responseHeaders["x-ms-chunk-size"] - 1}/${dwaRequest.data.length}`
				);
				expect(this.requests[1].requestHeaders["Content-Type"]).to.be.eq("application/octet-stream;charset=utf-8");
				expect(this.requests[2].requestHeaders["Content-Range"]).to.be.eq(
					`bytes ${beginResponse.responseHeaders["x-ms-chunk-size"]}-${dwaRequest.data.length - 1}/${dwaRequest.data.length}`
				);
				expect(this.requests[2].requestHeaders["Content-Type"]).to.be.eq("application/octet-stream;charset=utf-8");
			});

			it("does not have any response", function () {
				expect(responseObject).to.be.undefined;
			});
		});
	});

	describe("dynamicsWebApi.downloadFile -", function () {
		describe("file download in 2 chunks", function () {
			var dwaRequest = {
				key: mocks.data.testEntityId,
				collection: "tests",
				fieldName: "dwa_file",
			};

			var chunk1 = mocks.responses.downloadFileResponseChunk1;
			var chunk2 = mocks.responses.downloadFileResponseChunk2;

			var responseObject;
			before(function (done) {
				global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();

				var requests = (this.requests = []);

				global.XMLHttpRequest.onCreate = function (xhr) {
					requests.push(xhr);
				};

				var i = 0;
				xhrModule.afterSendEvent = function () {
					switch (i) {
						case 0:
							requests[i].respond(chunk1.status, chunk1.responseHeaders, chunk1.responseText);
							break;
						default:
							requests[i].respond(chunk2.status, chunk2.responseHeaders, chunk2.responseText);
							break;
					}

					i++;
				};

				global.window = {
					btoa: base64.btoa,
					atob: base64.atob,
					crypto: crypto,
				};

				dynamicsWebApiTest
					.downloadFile(dwaRequest)
					.then(function (object) {
						responseObject = object;
						done();
					})
					.catch(function (object) {
						responseObject = object;
						done();
					});
			});

			after(function () {
				global.XMLHttpRequest.restore();
				global.XMLHttpRequest = null;
				global.window = null;
				xhrModule.afterSendEvent = null;
			});

			it("sends the request to the right end point", function () {
				expect(this.requests[0].url).to.equal(
					mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.fieldName}?size=full`
				);
				expect(this.requests[1].url).to.equal(
					mocks.webApiUrl + mocks.responses.testEntityUrl.replace(/^\/|\/$/g, "") + `/${dwaRequest.fieldName}?size=full`
				);
			});

			it("uses the correct method", function () {
				expect(this.requests[0].method).to.equal("GET");
				expect(this.requests[1].method).to.equal("GET");
			});

			it("does not send data", function () {
				expect(this.requests[0].requestBody).to.be.undefined;
				expect(this.requests[1].requestBody).to.be.undefined;
			});

			it("sends correct headers", function () {
				expect(this.requests[0].requestHeaders["Range"]).to.be.eq(`bytes=0-${Utility.downloadChunkSize - 1}`);
				expect(this.requests[1].requestHeaders["Range"]).to.be.eq(`bytes=${Utility.downloadChunkSize}-${Utility.downloadChunkSize * 2 - 1}`);
			});

			it("does not have any response", function () {
				var text = Buffer.from(responseObject.data).toString();
				expect(text).to.eq("Welcome to DynamicsWebApi!");
				expect(responseObject.fileName).to.eq(chunk2.responseHeaders["x-ms-file-name"]);
				expect(responseObject.fileSize).to.eq(chunk2.responseHeaders["x-ms-file-size"]);
				expect(responseObject.location).to.eq(chunk2.responseHeaders["Location"]);
			});
		});
	});
});
