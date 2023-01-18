

var Promise = window.Promise

function _LrSDK() {
	this.entryPoints = {
  "importer" : {
    "path" : "sdk/lr-importer",
    "provides" : [
      "catalog"
    ],
    "assets" : [
      "https://static.lightroom.adobe.com/modern/sdk/lr-importer.94708e450965407c89f5.js"
    ]
  },
  "organizer" : {
    "path" : "sdk/lr-organizer",
    "assets" : [
      "https://static.lightroom.adobe.com/modern/sdk/lr-organizer.7b201de638c1c368412f.js"
    ]
  },
  "catalog" : {
    "path" : "sdk/lr-catalog",
    "assets" : [
      "https://static.lightroom.adobe.com/modern/sdk/lr-catalog.b7eccdf6ed162ef4e044.js"
    ]
  },
  "storycore" : {
    "path" : "sdk/lr-storycore",
    "assets" : [
      "https://static.lightroom.adobe.com/modern/sdk/lr-storycore.f04d728a4725b91df8bf.js"
    ]
  }
}
	this.assetURL = 'https://static.lightroom.adobe.com/'
	this.imsURL = 'https://ims-na1.adobelogin.com'
	this.pathIsLoaded = {}
	this.requirePromises = {}

	var scripts = document.querySelectorAll('script')
	var expr = /^(.*\/)sdk\/lr-sdk\.js.*$/
	for (var i = 0; i < scripts.length; i++) {
		var match = expr.exec(scripts[i].src)
		if (match) {
			this.baseURL = match[1]
		}
	}
	if (this.assetURL === '/') {
		this.assetURL = this.baseURL
	}
	this.environment = this.baseURL === 'https://lightroom.adobe.com/' ? 'prod' : 'stage'
}

_LrSDK.prototype.loadP = function(componentId) {
	var assets = this.entryPoints[componentId].assets
	if (assets == null) {
		throw new Error('Unknown LrSDK entry point "' + componentId + '"')
	}
	if (this.requirePromises[componentId]) {
		return this.requirePromises[componentId].promise
	}
	var that = this
	var promise = new Promise(function (resolve, reject) {
		that.loadComponentAssets(assets, reject)
		that.requirePromises[componentId] = {
			resolve: resolve,
			reject: reject
		}
	})
	that.requirePromises[componentId].promise = promise

	return promise
}

_LrSDK.prototype.initializeP = function(config) {
	var promises = [], promise
	var componentIds = Array.prototype.slice.call(arguments, 1)
	var provided = new Set()

	for (var componentIdIndex in componentIds) {
		if (componentIds.hasOwnProperty(componentIdIndex)) {
			var component = this.entryPoints[componentIds[componentIdIndex]]
			if (component.provides) {
				for (var itemIndex in component.provides) {
					if (component.provides.hasOwnProperty(itemIndex)) {
						provided.add(component.provides[itemIndex])
					}
				}
			}
		}
	}

	// takes a list of component identifiers of required components
	for (var componentIdIndex in componentIds) {
		if (componentIds.hasOwnProperty(componentIdIndex)) {
			var componentId = componentIds[componentIdIndex]
			var that = this
			if (this.requirePromises[componentId] == null) {
				var assets = this.entryPoints[componentId].assets
				if (assets == null) {
					throw new Error('Unknown LrSDK entry point "' + componentId + '"')
				}
				promise = new Promise(function (resolve, reject) {
					if (!provided.has(componentId)) {
						that.loadComponentAssets(assets, reject)
					}
					that.requirePromises[componentId] = {
						resolve: resolve,
						reject: reject
					}
				}).then(function(component) {
					if (config && component && component.initialize && typeof component.initialize === 'function') {
						component.initialize(config)
					}
					return component
				})
				that.requirePromises[componentId].promise = promise
				promises.push(promise)
			}
			else {
				promises.push(this.requirePromises[componentId].promise)
			}
		}
	}

	return Promise.all(promises)
}

_LrSDK.prototype.loadComponentAssets = function(assets, reject) {
	for (var i in assets) {
		var path = assets[i]
		if (this.pathIsLoaded[path] == null) {
			this.pathIsLoaded[path] = true

			if (path[0] === '/') {
				path = this.getRelativeUrl(path)
			}

			if (/\.js$/.test(path)) {
				var scriptNode = document.createElement('script')
				scriptNode.onerror = function loadError(error) {
					reject(new Error("SDK failed to load SDK component at " + path))
				}
				scriptNode.src = path
				document.head.appendChild(scriptNode)
			} else if (/\.css$/.test(path)) {
				var styleNode = document.createElement('link')
				styleNode.rel = 'stylesheet'
				styleNode.href = path
				document.head.appendChild(styleNode)
			}
		}
	}
}

_LrSDK.prototype.provide = function(componentId, module) {
	if (this.entryPoints[componentId] == null) {
		throw new Error("LrSDK: Unknown entry point: " + componentId)
	}
	var promiseData = this.requirePromises[componentId]
	if (promiseData != null) {
		promiseData.resolve(module)
	}
	this[componentId] = module
}

_LrSDK.prototype.getRelativeUrl = function(relative) {
	if (relative.length > 0 && relative[0] === '/') {
		relative = relative.slice(1)
	}
	var base = this.assetURL
	if (base.length > 0 && base.slice(-1) === '/') {
		base = base.slice(0, -1)
	}
	return base + "/" + relative
}

if (window.LrSDK == null) {
	window.LrSDK = new _LrSDK()
}
