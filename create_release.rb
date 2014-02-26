require 'fileutils'
releases_dir = 'releases'
# Filenames, directory names, etc. Any string that matches entirely or starts with this is excluded
exclusions = ['releases', 'tests', 'README.md', 'create_release.rb']

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
		target = "#{dir}\\#{file}"
		FileUtils.mkdir_p(File.dirname(target))
		if File.directory?(file)
			FileUtils.mkdir_p(File.dirname(target))
		else
			FileUtils.cp(file, target)
		end
		
		index_file = file if file.end_with?('index.html')
	end
	
	### Edit index.html and combine all the data files into one	
	if index_file.nil?
		raise 'Didn\'t find the index.html file. Uhoh.'
	else		
		puts 'Compressing data/maps/*.js into data/maps.js ...'
		contents = File.read(index_file)
		data_file_regex = /<script.+src=['"](data\/maps\/[^'"]+)['"].*<\/script>/i
		data_files = contents.scan(data_file_regex)
		# Replace first instance with conglamorated data
		contents = contents.sub(data_file_regex, '***placeholder***')
		contents = contents.gsub(data_file_regex, '')
		contents = contents.sub('***placeholder***', '<script src="data/maps.js"></script>')
		File.write("#{dir}/index.html", contents)
		maps = ''
		
		data_files.each do  |d|
			d.each do |x|
				puts "  Added #{x}"
				maps += File.read(x) + "\n"
			end
		end
		FileUtils.rm_rf("#{dir}/data/maps")
		File.write("#{dir}/data/maps.js", maps)
		puts 'Done.'
	end
end