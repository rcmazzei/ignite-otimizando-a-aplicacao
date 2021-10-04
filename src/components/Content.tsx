
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Grid, AutoSizer, ListRowRenderer, GridCellRenderer } from 'react-virtualized';
import { api } from '../services/api';
import { MovieCard } from "./MovieCard";

interface ContentProps {
  selectedGenre: {
    id: number;
    name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
    title: string;
  };

  // movies: Array<{
  //   imdbID: string;
  //   Title: string;
  //   Poster: string;
  //   Ratings: Array<{
  //     Source: string;
  //     Value: string;
  //   }>;
  //   Runtime: string;
  // }>;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

function ContentComponent({ selectedGenre }: ContentProps) {
  const [movies, setMovies] = useState<MovieProps[]>([]);

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenre.id}`).then(response => {
      setMovies(response.data);
    });
  }, [selectedGenre.id]);


  const quantity = useMemo(() => {
    return movies.length;
  }, [movies]);

  const cellRenderer: GridCellRenderer = ({ key, rowIndex, columnIndex, style }) => {
    const index = (rowIndex * 3) + columnIndex;

    const movie = movies[index];

    if (!movie) return;

    return (
      <div
        key={key}
        style={style}
      >
        <MovieCard
          key={movie.imdbID}
          title={movie.Title}
          poster={movie.Poster}
          runtime={movie.Runtime}
          rating={movie.Ratings[0].Value}
        />
      </div>
    )
  }

  return (
    <div className="container">
      <header>
        <span className="category">Categoria:<span> {selectedGenre.title} - {quantity}</span></span>
      </header>

      <main>
        <AutoSizer>
          {
            ({ width, height }) => (
              <Grid
                height={height}
                width={width}
                columnCount={3}
                columnWidth={280}
                rowHeight={400}
                overscanRowCount={1}
                rowCount={Math.ceil(movies.length / 3)}
                cellRenderer={cellRenderer}
              />
            )
          }
        </AutoSizer>
        {/* <div className="movies-list">
          {movies.map(movie => (
            <MovieCard
              key={movie.imdbID}
              title={movie.Title}
              poster={movie.Poster}
              runtime={movie.Runtime}
              rating={movie.Ratings[0].Value}
            />
          ))}
        </div> */}
      </main>
    </div>
  )
}

export const Content = React.memo(ContentComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.selectedGenre, nextProps.selectedGenre);
})