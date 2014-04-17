class Main
	def main
		if ARGV[0].nil?
			puts "Usage: ruby process-map.rb <map name> (without .json suffix)"
		else
			require 'json'
			
			@base_name = ARGV[0] # prefix of map files
			@json = JSON.parse(File.read("#{@base_name}.json")) # raw input			
			
			puts "Creating files for #{@base_name} ..."
			create_tileset_file
			create_tiles_file
			copy_files	
			puts 'Done.'
		end
	end
	
	def create_tiles_file
		puts "Creating tiles file from #{@base_name}.json ..."
		# JSON parse the JSON file and write stuff in mapName.tiles		
		width = @json['width']
		height = @json['height']	
		
		# For each layer (they go from lowest to highest)
			# Go through each tile. Since you know map width/height, you can deduce X/Y.
			# Ignore every 0 (no tile) and 1 (ground/background tile)		
		data = []
		# Layers are already sorted ascendingly, which is awesome
		@json['layers'].each do |layer|
			index = 0
			layer['data'].each do |tile_index|
				index += 1				
				next if tile_index == 0 || @ignore.include?(tile_index)
				x = index % width
				y = index / width				
				data << { :x => x, :y => y, :z => @above.include?(tile_index) ? 200 : 50, :tile => tile_index }
			end		
		end
		
		map = data
		File.open("#{@base_name}_tiles.js", 'w') do |file|
			file.write("function #{@base_name}_tiles() {\n\tvar tiles = ")
			file.write(map.to_json)
			file.write(";\n\n\treturn tiles;\n}")
		end
	end
	
	def create_tileset_file
		puts "Creating tileset file from #{@base_name}.json ..."
		tileset_json = { }		
		
		tilesets = []
		ignore = []
		above = []
		
		@json['tilesets'].each do |t|
			image = t['image']
			image = image[3, image.length] if image.start_with?('../')			
			tilesets << image
			tileset_json['width'] = t['imagewidth'] / t['tilewidth']
			tileset_json['height'] = t['imageheight'] / t['tileheight']

			@tiles_wide = tileset_json['width']
			@tiles_high = tileset_json['height']
			
			ignore = t['properties']['ignore'] unless t['properties'].nil? || t['properties']['ignore'].nil?
			above = t['properties']['above'] unless t['properties'].nil? || t['properties']['above'].nil?
			ignore ||= ""
			above ||= ""
		end
		
		@ignore = parse_range(ignore)
		@above = parse_range(above)		
				
		tileset_json['tilesets'] = tilesets
		tileset_json['ignore'] = @ignore
		tileset_json['above'] = @above		
		
		File.open("#{@base_name}_tileset.js", 'w') do |file|
			file.write("function #{@base_name}_tileset() {\n\tvar tileset = ")
			file.write(tileset_json.to_json)
			file.write(";\n\n\treturn tileset;\n}")
		end		
	end
	
	# Text is a combination of digits and ranges
	# eg. 1, 3, 16-19
	def parse_range(text)
		to_return = []
		text.scan(/(\d+-\d+)|(\d)/).to_a.each do |m|			
			m.each do |value|
				next if value.nil?					
				if value.to_s.include?("-")					
					start = /\d+/.match(value.to_s).to_s.to_i
					# Experimentally derived. My eyes!!			
					stop = /\d+/.match(value.to_s, value.index(start.to_s) + start.to_s.length).to_s.to_i				
					(start..stop).each do |s|
						to_return << s
					end
				else
					to_return << value.to_i
				end
			end
		end
		
		return to_return
	end
	
	def copy_files
		require 'fileutils'
		FileUtils.mv("#{@base_name}_tiles.js", "../data/maps/#{@base_name}_tiles.js")
		FileUtils.mv("#{@base_name}_tileset.js", "../data/maps/#{@base_name}_tileset.js")
	end
		
end

Main.new.main
