require 'fileutils'
releases_dir = 'releases'
# Filenames, directory names, etc. Any string that matches entirely or starts with this is excluded
exclusions = ['releases', 'tests', 'README.md', 'create_release.rb', 'screenshot.png']

if ARGV[0].nil?
	puts "You must specify a release version, eg. '0.1' (it goes into the relevant directory)."
else
	version = ARGV[0]
	dir = "#{releases_dir}/#{version}"
	puts "Publishing to #{dir} ..."
	if File.directory?(dir) then
		puts "Re-creating directory."
		FileUtils.rm_rf(dir) 		
	end
	FileUtils.mkdir_p(dir)
	
	### Copy over all the necessary files ###
	files = []
	Dir.glob("**/*") { |fileName|
		is_excluded = false
		exclusions.each do |exclusion|
			exclusion.downcase!
			is_excluded = true if (exclusions == fileName.downcase || fileName.downcase.start_with?(exclusion))
		end		
		files << fileName if (!is_excluded)
	}
	
	#FileUtils.cp_r(files, dir) dumps files into the root directory
	index_file = nil
	
	files.each do |file|		
		target = "#{dir}/#{file}"
		FileUtils.mkdir_p(File.dirname(target))
		if File.directory?(file)
			FileUtils.mkdir_p(File.dirname(target))
		else
			FileUtils.cp(file, target)
		end
		
		index_file = file if file.end_with?('index.html')
	end

	### Edit index.html and combine all the JS files into one	
	if index_file.nil?
		raise 'Didn\'t find the index.html file. Uhoh.'
	else		
		puts 'Compressing Javascript files into code.js ...'
		
		index_file = File.read(index_file)
		script_regex = /<script.*src=['"]([^'"]+)['"][^<]*<\/script>/		
		arrays = index_file.scan(script_regex) # Gets an array of arrays
		files = []
		arrays.each do |a|
			a.each do |f|
				files << f
			end
		end
		puts "\tMinifying #{files.length} files ..."
		conglamorate = ''

		files.each do |f|
			file_name = "#{f.to_s}".chomp.strip
			begin
				contents = File.read(file_name)
				conglamorate = "#{conglamorate}#{contents}\n"
			rescue
				puts "\t\tskipping #{file_name}"
			end
		end

		puts "\tWriting to file system ..."
		File.open("#{dir}/code.js", "w") { |f|
			f.write(conglamorate)
		}
		
		# Create an updated index file.
		# Replace the first JS file with code.js
		updated_index = index_file.sub(script_regex, '***placeholder***')
		updated_index = updated_index.gsub(script_regex, '')
		updated_index = updated_index.sub('***placeholder***', '<script type="text/javascript" src="code.js"></script>')
		File.write("#{dir}/index.html", updated_index)		
		puts "Done! #{dir}/index.html references code.js."
		puts 'You can minify it here: http://jscompress.com'

		files.each do |f|
			index = f.index('/')
			index = f.index('/') if index.nil?
			index = f.length if index.nil? && !f.ends_with?('.js')
			
			dir_name = f[0, f.index('/')]
			FileUtils.rm_rf("#{dir}/#{dir_name}")
		end
		puts 'Removed Javascript files.'		
	end
end
