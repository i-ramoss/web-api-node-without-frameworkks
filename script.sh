echo -e "\n\n requesting all heroes"
curl localhost:3000/heroes

echo -e "\n\n requesting black panther"
curl localhost:3000/heroes/1

echo -e "\n\n requesting with wrong body"
curl --silent -X POST \
    --data-binary "{'invalid': 'data'}" \
    localhost:3000/hereos