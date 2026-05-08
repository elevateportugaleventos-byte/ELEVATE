require 'webrick'
Dir.chdir(File.dirname(__FILE__))
server = WEBrick::HTTPServer.new(Port: 3000, DocumentRoot: File.dirname(__FILE__))
trap('INT') { server.shutdown }
server.start
