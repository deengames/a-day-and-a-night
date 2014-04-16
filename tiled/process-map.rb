class Main
	def main
		if ARGV[0].nil?
			puts "Usage: ruby process-map.rb <map name> (without .json suffix)"
		else
			require 'json'
			
			@base_name = ARGV[0] # prefix of map files
			@json = JSON.parse(File.read("#{@base_name}.json")) # raw input
			@map = {} # raw output
			
			create_tiles_file
			create_tileset_file
		end
	end
	
	def create_tiles_file
		# JSON parse the JSON file and write stuff in mapName.tiles		
		width = @json['width']
		height = @json['height']	
		
		# For each layer (they go from lowest to highest)
			# Go through each tile. Since you know map width/height, you can deduce X/Y.
			# Ignore every 0 (no tile) and 1 (ground/background tile)
		index = 0
		data = []
		# Layers are already sorted ascendingly, which is awesome	
		@json['layers'].each do |layer|
			layer['data'].each do |tile_index|
				next if tile_index == 0 || tile_index == 1
				x = index % width
				y = index / height
				index += 1
				data << { :x => x, :y => y, :tile => index }
			end		
		end
			
		@map[:tiles] = data
		File.open("#{@base_name}.tiles", 'w') do |file|
			file.write(@map.to_json)
		end
	end
	
	def create_tileset_file
		
		tileset_filename = "#{@base_name}.tileset"
		if File.exist?(tileset_filename) then
			tileset_json = JSON.parse(File.read(tileset_filename))
		else
			tileset_json = { :solid_tiles => [] }			
		end
		
		tilesets = []
		
		@json['tilesets'].each do |t|
			image = t['image']
			image = image[3, image.length] if image.start_with?('../')			
			tilesets << image
		end
		
		tileset_json['tilesets'] = tilesets
		
		File.open("#{@base_name}.tileset", 'w') do |file|
			file.write(tileset_json.to_json)
		end		
	end
end

Main.new.main
