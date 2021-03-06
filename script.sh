echo -e "\n\n requesting all heroes"
curl localhost:3000/heroes

echo -e "\n\n requesting black panther"
curl localhost:3000/heroes/1

echo -e "\n\n requesting with wrong body"
curl --silent -X POST \
    --data-binary '{"invalid": "data"}' \
    localhost:3000/heroes


echo -e "\n\n creating black panther"
CREATE=$(curl --silent -X POST \
    --data-binary '{"name": "Black Panther", "age": 35, "power": "Agility"}' \
    localhost:3000/heroes)

echo $CREATE