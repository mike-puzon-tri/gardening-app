import { useQuery, gql } from '@apollo/client';
import GardenBed from './garden-bed';

export const GET_BEDS = gql`
  query {
    beds {
      id
      name
      width
      height
      plants {
        plant
        x
        y
      }
    }
  }
`;

function BedList() {
  const { loading, error, data } = useQuery(GET_BEDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <h4>Garden Beds</h4>
      {data.beds.map((item) => (
        <p key={item.id} className="">
          {item.name} ({item.width} x {item.height})
          <GardenBed height={item.height} width={item.width} bedId={item.id} plants={item.plants} />
        </p>
      ))}
    </div>
  );
}

export default BedList;
