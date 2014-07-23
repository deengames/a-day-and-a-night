#========================================================================
# ** Logger
#    By: ashes999 (ashes999@yahoo.com)
#    Version: 1.0
#------------------------------------------------------------------------
# * Description:
# Allows you to log messages at a given level (default is :info).
# Levels are: :info, :debug. 
#========================================================================

LOGGING_LEVEL = :info

#### end of parameters ###

DEFAULT_FILENAME = 'log.txt'
LEVELS = { :info => 1, :debug => 2 }

class Logger

	def self.initialize(filename)
		@filename = filename
		File.open(@filename, 'w') { |f| f.write("Log created at #{Time.new}\n") }
	end

	def self.log(message, level = LOGGING_LEVEL)
		return if level > LOGGING_LEVEL
		File.open(@filename, 'a') { |f| f.write("#{Time.new}|#{level}|#{message}\n") }
	end
	
	def self.info(message)
		Logger.log(message, :info)
	end
	
	def self.debug(message)
		Logger.log(message, :debug)
	end		
end

