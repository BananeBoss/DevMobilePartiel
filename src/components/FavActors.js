import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';

import ActorlistItem from './ActorListItem.js';
import DisplayError from '../components/DisplayError';

import { getActorDetails } from '../api/theMovieDB';

const FavActors = ({ navigation, favActors }) => {

  const [actors, setActors] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    refreshFavActors();
  }, [favActors]); // A chaque fois que les acteurs favoris changent

  const refreshFavActors = async () => {
    setIsRefreshing(true);
    setIsError(false);
    let actors = [];
    try {
      for (const id of favActors) {
        const theMovieDBSearchResult = await getActorDetails(id);
        actors.push(theMovieDBSearchResult);
      };
      setActors(actors);
      console.log(actors);
    } catch (error) {
      setIsError(true);
      setActors([]);
    }
    setIsRefreshing(false);
  };

  const navigateToActorDetails = (actorsID) => {
    navigation.navigate("ViewActor", { actorsID });
  };

  const amIaFavActor = (actorID) => {
    if (favActors.findIndex(i => i === actorID) !== -1) {
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      {
        isError ?
          (<DisplayError message='Impossible de récupérer les acteurs favoris' />) :
          (<FlatList
            data={actors}
            extraData={favActors}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ActorlistItem
              actorData={item}
                onClick={navigateToActorDetails}
                isFav={amIaFavActor(item.id)} />
            )}
            refreshing={isRefreshing}
            onRefresh={refreshFavActors}
          />)
      }
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    favActors: state.favActorsID
  }
}

export default connect(mapStateToProps)(FavActors);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    marginTop: 16,
  },
});