package com.example.serpumar.sprint0_3a.Models;

public class Recompensa {

    private int id;
    private String titulo;
    private String descripcion;
    private int coste;
    private int imageId;

    public Recompensa(int id, String titulo, String descripcion, int coste, int imageId) {

        this.id = id;
        this.titulo = titulo;
        this.descripcion= descripcion;
        this.coste= coste;
        this.imageId = imageId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String info) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public int getCoste() {
        return coste;
    }

    public void setCoste(int coste) {
        this.coste = coste;
    }

    public int getImageId() {
        return imageId;
    }

    public void setImageId(int imageId) {
        this.imageId = imageId;
    }
}
