function y = interpolacion()
TIPOGASES = ["GI", "CO2", "NO2", "O3", "SO2"];
format long;
%[x]Generar JSON
%[x]INTERPOLAR*
%[]Falta crear historico de mapas
%[x]Falta sacar mediciones interpoladas con sus lat long + las de entrada
%
%JSONFILE_HISTORICO= sprintf('%s_JSON%d.json',Date(),1);



JSONFILE_name= '../Datos/medicionesInterpoladas.json';
fid=fopen(JSONFILE_name,'w');
fprintf(fid, '[');

for tg=1:length(TIPOGASES)
    
    
    M = readmatrix(strcat('../Datos/',TIPOGASES(tg),'medicionesBD.txt'));
    fprintf(fid, strcat('{"TipoMedicion":"',TIPOGASES(tg),'","mediciones":['));
    if isempty(M) 
    
    else
    Lat=M([1],:);
    Lon=M([2],:);
    Val=M([3],:);
    
    %GRID PARA ZONA GND
    LatStep = 3.6015e-04;
    LonStep = 4.6208e-04;
    
    if (max(Lat)- min(Lat)) < LatStep
        LatStep = (max(Lat)- min(Lat))/10;
    end
    if (max(Lon)- min(Lon)) < LonStep
        LonStep = (max(Lon)- min(Lon))/10;
    end
    
    latGRID = (min(Lat)):LatStep: (max(Lat));
    lonGRID = (min(Lon)):LonStep: (max(Lon));

    [LATGRID,LONGRID]=meshgrid(latGRID,lonGRID);
    
    values = griddata(Lat,Lon,Val,LATGRID,LONGRID,'v4');
    
     %figure(tg)
     %mesh(LATGRID,LONGRID,values);
     %hold on;
     %plot3(Lat,Lon,Val,"O");
     %title(TIPOGASES(tg));
     
        for row=1:size(values, 1)
            for col=1:size(values, 2)
                s = struct("lat",latGRID(col), "lon", lonGRID(row) , "value", round(values(row, col),4)); 
                encodedJSON = jsonencode(s); 
                
                fprintf(fid, encodedJSON);

                if row == size(values, 1) && col == size(values, 2)
                    
                else
                    fprintf(fid, ',');
                end
            end   
        end
    end
    fprintf(fid, ']}');
    if tg < length(TIPOGASES)
        fprintf(fid, ',');
    end
end

fprintf(fid,']');
fclose('all');
y = 1;
exit;
end