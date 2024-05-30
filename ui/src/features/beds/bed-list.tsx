import { useQuery, gql } from '@apollo/client';
import GardenBed from './garden-bed';

export const GET_BEDS = gql`
  query {
    beds {
      id      
      width
      height
      plants {
        name
      }
    }
  }
`;

function BedList() {
  const { loading, error, data } = useQuery(GET_BEDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  console.log(data);
  return (
    <div>
      <h4>Garden Beds</h4>
      {data.beds.map((item) => (
        <p key={item.id} className=''>
          {item.id} ({item.width} x {item.height})
          <GardenBed height={item.height} width={item.width} />
        </p>
      ))}
    </div>
  );
}

export default BedList;