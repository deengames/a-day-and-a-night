require 'fileutils'
platform = :windows
root_dir = 'temp'
delete_files = ['.gitignore', 'README.md', '.git', '.gitignore', 'create-release.rb']
delete_wildcards = ['Graphics/*.xcf', 'Save*.rvdata2', '*.sh']

begin
  `ls /tmp`
  platform = :linux
  root_dir = '/tmp'
  puts 'Linux detected ...'
rescue
end

dir = "#{root_dir}/release"
FileUtils.mkdir_p(dir)

puts 'Cleaning up files for release ...'
puts "Release files are in #{dir}."
puts 'Copying files ...'
Dir.glob('*').each do |d|
  FileUtils.cp_r(d, "#{dir}") unless d == root_dir
end

puts '... done. Deleting unnecessary files and unsetting RTP ...'

delete_files.each do |d|
  FileUtils.rm("#{dir}/#{d}", :force => true)
end

delete_wildcards.each do |d|
  Dir.glob("#{dir}**/#{d}").each do |f|
    File.delete(f)
  end
end

game_ini = File.read("#{dir}/Game.ini")
game_ini = game_ini.gsub(/RTP=.*$/, 'RTP=')
File.write("#{dir}/Game.ini", game_ini)

puts "Done. #{dir}/Game.rvproj2 remains; delete it, or compress your game."