require 'fileutils'
releases_dir = 'releases'
# Filenames, directory names, etc. Any string that matches entirely or starts with this is excluded
exclusions = ['releases', 'tests', 'README.md', 'create_release.rb']

if ARGV[0].nil?
	puts "You must specify a release version, eg. '0.1' (it goes into the relevant directory)."
else
	version = ARGV[0]
	dir = "#{releases_dir}/#{version}"
	FileUtils.rm_rf(dir) if File.directory?(dir)
	FileUtils.mkdir_p(dir)
	
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
	files.each do |file|		
		target = "#{dir}\\#{file}"
		FileUtils.mkdir_p(File.dirname(target))
		if File.directory?(file)
			FileUtils.mkdir_p(File.dirname(target))
		else
			FileUtils.cp(file, target)
		end
	end
		
end