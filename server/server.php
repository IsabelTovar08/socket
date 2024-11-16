<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require __DIR__ . '/vendor/autoload.php';

class Chat implements MessageComponentInterface
{
    protected $clients;
    protected $connectionHistory = [];
    protected $host = null;

    public function __construct()
    {
        $this->clients = new \SplObjectStorage();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";

        $conn->send(json_encode([
        'type' => 'history',
        'history' => $this->connectionHistory
    ]));

        // Si es el primer usuario, se convierte en el "host"
        if ($this->host === null) {
            $this->host = $conn;
            $conn->send(json_encode(['type' => 'host']));
        }

        // Solicitar el nombre del usuario
        $conn->send(json_encode(['type' => 'requestName']));
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);

        if ($data['type'] === 'endChat' && $from === $this->host) {
            $this->sendToAll(['type' => 'chatEnded']);
            foreach ($this->clients as $client) {
                $client->close(); // Cierra las conexiones
            }
            return;
        }

        if ($data['type'] === 'setUserName') {
            $from->userName = $data['userName'];
            $newConnection = ['type' => 'newConnection', 'message' => "{$from->userName} se ha unido al chat"];
            $this->sendToAll(data: $newConnection);
            $this->connectionHistory[] = $newConnection;
        }

        if (isset($data['message'])) {
            foreach ($this->clients as $client) {
                if ($from !== $client) {
                    $client->send(json_encode(['type' => 'chat', 'message' => $data['message']]));
                }
            }
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    
        // Obtiene el nombre del usuario desconectado, si existe
        $userName = isset($conn->userName) ? $conn->userName : 'Un usuario';
    
        // Notifica a todos los clientes que el usuario se ha desconectado
        $disconnection = [
            'type' => 'disconnection',
            'message' => "$userName ha abandonado el chat"
        ];
        $this->sendToAll($disconnection);
    
        // Guarda la notificación de desconexión para los próximos usuarios
        $this->connectionHistory[] = $disconnection;
    }
    

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    private function sendToAll($data)
    {
        foreach ($this->clients as $client) {
            $client->send(json_encode($data));
        }
    }
}

// Puerto dinámico asignado por el hosting en la nube, o 8080 si no existe.
$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new Chat()
        )
    ),
    8080
);

$server->run();