package com.example.serpumar.sprint0_3a.Models;

public class Usuario {

    private int id;
    private String nombre_completo;
    private String nombre_usuario;
    private String contrasenya;
    private String correo;
    private int puntuacion;
    private int puntosCanjeables;
    private String telefono;
    private String idNodo;

    public Usuario(int id, String nombre_completo, String nombre_usuario, String contrasenya, String correo, int puntuacion, int puntosCanjeables, String telefono, String idNodo){
        this.id= id;
        this.nombre_completo = nombre_completo;
        this.nombre_usuario = nombre_usuario;
        this.contrasenya= contrasenya;
        this.correo= correo;
        this.puntuacion= puntuacion;
        this.puntosCanjeables= puntosCanjeables;
        this.telefono= telefono;
        this.idNodo= idNodo;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombre_usuario;
    }

    public void setNombreUsuario(String nombre) {
        this.nombre_usuario = nombre;
    }

    public String getNombreCompleto() {
        return nombre_completo;
    }

    public void setNombreCompleto(String nombre) {
        this.nombre_completo = nombre;
    }

    public String getContrasenya() {
        return contrasenya;
    }

    public void setContrasenya(String contrasenya) {
        this.contrasenya = contrasenya;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public int getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(int puntuacion) {
        this.puntuacion = puntuacion;
    }

    public int getPuntosCanjeables() {
        return puntosCanjeables;
    }

    public void setPuntosCanjeables(int puntosCanjeables) {
        this.puntosCanjeables = puntosCanjeables;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getIdNodo() {
        return idNodo;
    }

    public void setIdNodo(String idNodo) {
        this.idNodo = idNodo;
    }
}
