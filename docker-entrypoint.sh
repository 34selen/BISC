dockerize -wait tcp://mysql:3306 -timeout 20s

echo "Start Challange server"
sleep 10
node src/server.js