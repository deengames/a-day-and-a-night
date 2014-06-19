#========================================================================
# ** Expose Data
#    By: ashes999
#    Version: 0.1
#------------------------------------------------------------------------
# * Description:
# Automatically converts .rvdata2 files into plain text, so you can view
# them and diff them and manage changes to your game more easily.
#========================================================================
files = Dir.glob('Data/*.rvdata2')
files.each do |f|
    binary = File.binread(f)
    object = Marshal.load(binary)
	File.open(f.sub('.rvdata2', '-data.txt'), 'w') { |out| out.write(object) }
end