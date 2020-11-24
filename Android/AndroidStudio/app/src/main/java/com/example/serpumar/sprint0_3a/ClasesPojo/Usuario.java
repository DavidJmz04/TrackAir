package com.example.serpumar.sprint0_3a.ClasesPojo;

public class Usuario {

    private int id;
    private String nombre;
    private String contrasenya;
    private String correo;
    private int puntuacion;
    private int puntosCanjeables;
    private String telefono;
    private String idNodo;

    public Usuario(int id, String nombre, String contrasenya, String correo, int puntuacion, int puntosCanjeables, String telefono, String idNodo){
        this.id= id;
        this.nombre= nombre;
        this.nombre= contrasenya;
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

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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
