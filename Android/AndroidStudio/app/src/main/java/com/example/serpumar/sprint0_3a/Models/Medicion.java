package com.example.serpumar.sprint0_3a.Models;

public class Medicion {

    private int medicion;
    private Ubicacion ubicacion;
    private String date;
    private  String tipoMedicion;

    public Medicion(int medicion_, Ubicacion ubicacion_, String date_, String tipoMedicion_) {
        this.medicion = medicion_;
        this.ubicacion = ubicacion_;
        this.date = date_;
        this.tipoMedicion = tipoMedicion_;
    }

    public int getMedicion() {
        return medicion;
    }

    public void setMedicion(int medicion) {
        this.medicion = medicion;
    }

    public Ubicacion getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(Ubicacion ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTipoMedicion() {
        return tipoMedicion;
    }

    public void setTipoMedicion(String tipoMedicion) {
        this.tipoMedicion = tipoMedicion;
    }
}
