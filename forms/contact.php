<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Create a new PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPSecure = 'tls';
    $mail->SMTPAuth = true;
    $mail->Username = 'sptech3dx@gmail.com'; // Your Gmail email address
    $mail->Password = 'Sanket@9822'; // Your Gmail password

    // Recipients
    $mail->setFrom($mail->Username, 'your site'); // Your name and Gmail email address
    $mail->addAddress('sanketpatil3dx@gmail.com', 'Sanket Patil'); // Recipient's name and email address

    // Email content
    $mail->isHTML(true);
    $mail->Subject ='hi';
    $mail->Body = 'Hey';

    // Send the email
    $mail->send();
    echo 'Email sent successfully!';
} catch (Exception $e) {
    echo 'Failed to send email. Error: ' . $mail->ErrorInfo;
}
?>

