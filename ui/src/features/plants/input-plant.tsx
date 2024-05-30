import { useMutation, gql } from '@apollo/client';
import { Button, Card, CardBody, CardFooter, Input, Typography } from '@material-tailwind/react';
import { GET_PLANTS } from './plant-list';

const ADD_Plant = gql`
mutation AddPlant($input: PlantInput) {
    addPlant(input: $input) {
      id
      name
    }
  }
`;
function InputPlant() {
  const [addPlant, { data, loading, error }] = useMutation(ADD_Plant);

  const handleSubmit = (e) => {
    console.log('submit plant');
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    formJson.width = parseInt(formJson.width)
    formJson.height = parseInt(formJson.height)
    

    addPlant({
      variables: {
        input: formJson        
      },
      refetchQueries: [
        {
          query: GET_PLANTS
        }
      ]
    });
  };

  if (loading) return <p>Submitting...</p>;
  if (error) return <p>Submit Error : {error.message}</p>;

  return (
    <div className="grid">
      <form onSubmit={handleSubmit}>
        <Card className="my-4 w-96">
          <CardBody>
            <Typography variant="h5" color="blue-gray" className="mb-2">
              Add a new plant
            </Typography>
            <div className="m-3">
              <Input color="gray" name="name" required label="Plant Name" size="lg" />
            </div>

            <div className="m-3">
              <Input color="gray" name="width" required type="number" label="Width" size="lg" />
            </div>
            <div className="m-3">
              <Input color="gray" name="height" required type="number" label="Height" size="lg" />
            </div>
          </CardBody>
          <CardFooter className="pt-0">
            <Button color="gray" type="submit" className="w-full py-[14px] md:w-40">
              add plant
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default InputPlant;
