_ = require 'lodash'
fs = require 'fs'
detective = require 'detective'

args = process.argv.slice 2
count = args.length
deps = []

args.forEach (arg, n) ->

	fs.exists arg, (exists) ->

		# check if file exists
		(throw new Error "file/dir #{arg} doesn't exist!") if not exists

		# read files
		fs.readFile "#{__dirname}/#{arg}", (err, content) ->

			(throw new Error err) if err

			# add dependencies
			deps.push (detective content)
				.filter (item) ->
					item = item + ''
					(item.indexOf './') is -1 and (item.indexOf '../') is -1

			# done?
			(fin _.unique _.flatten deps) if n is count - 1

fin = (deps) ->

	json =
		name: _.last __dirname.split '/'
		dependencies: _.mapValues (_.invert _.extend {}, deps), ->
			'x.x.x'

	process.stdout.write JSON.stringify json